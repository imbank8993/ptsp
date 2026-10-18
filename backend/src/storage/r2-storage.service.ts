import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as crypto from 'crypto';

@Injectable()
export class R2StorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly client: S3Client;
  private readonly bucketName: string;
  private readonly publicBaseUrl: string;
  private readonly ptspFolder: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.get<string>('r2.accountId');
    const accessKeyId = this.configService.get<string>('r2.accessKeyId');
    const secretAccessKey = this.configService.get<string>('r2.secretAccessKey');
    this.bucketName = this.configService.get<string>('r2.bucket');
    this.publicBaseUrl = this.configService.get<string>('r2.publicBaseUrl');
    this.ptspFolder = this.configService.get<string>('r2.ptspFolder') || 'PTSP';

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.logger.log(`Cloudflare R2 Storage initialized for bucket: ${this.bucketName}, folder: ${this.ptspFolder}`);
  }

  /**
   * Validate file buffer signatures (magic numbers) to prevent file extension spoofing
   */
  private validateMagicBytes(buffer: Buffer, declaredExt: string): boolean {
    if (buffer.length < 4) return false;

    // PDF: %PDF (25 50 44 46)
    const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;

    // JPEG: FF D8 FF
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

    // PNG: 89 50 4E 47
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;

    switch (declaredExt.toLowerCase()) {
      case 'pdf':
        return isPdf;
      case 'jpg':
      case 'jpeg':
        return isJpeg;
      case 'png':
        return isPng;
      default:
        return false;
    }
  }

  /**
   * Uploads a file to Cloudflare R2 under the PTSP directory
   */
  async uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    subfolder = 'documents',
    maxSizeMb = 10,
  ): Promise<{ file_url: string; file_path: string; file_size: number }> {
    // 1. File size check
    const maxSizeBytes = maxSizeMb * 1024 * 1024;
    if (fileBuffer.length > maxSizeBytes) {
      throw new BadRequestException(`Ukuran berkas melebihi batas maksimal ${maxSizeMb} MB`);
    }

    // 2. Extract and validate extension
    const parts = originalFilename.split('.');
    const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';
    const allowedExts = ['pdf', 'jpg', 'jpeg', 'png'];

    if (!allowedExts.includes(ext)) {
      throw new BadRequestException('Format berkas tidak didukung. Harap unggah PDF, JPG, JPEG, atau PNG.');
    }

    // 3. Security Magic Bytes check
    const isValidSignature = this.validateMagicBytes(fileBuffer, ext);
    if (!isValidSignature) {
      throw new BadRequestException('Format berkas tidak valid atau rusak (pemeriksaan integritas gagal).');
    }

    // 4. Secure Random Key generation
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(6).toString('hex');
    const sanitizedBase = parts
      .join('.')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);

    const safeFilename = `${timestamp}_${randomHex}_${sanitizedBase}.${ext}`;
    // Key format: PTSP/<subfolder>/<safeFilename>
    const cleanSubfolder = subfolder.replace(/[^a-zA-Z0-9_-]/g, '');
    const key = `${this.ptspFolder}/${cleanSubfolder}/${safeFilename}`;

    // 5. Determine Content Type
    let contentType = 'application/octet-stream';
    if (ext === 'pdf') contentType = 'application/pdf';
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';

    // 6. Perform Upload
    try {
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
          ContentDisposition: 'inline',
        },
      });

      await upload.done();

      const base = this.publicBaseUrl.replace(/\/$/, '');
      const fileUrl = `${base}/${key}`;

      this.logger.log(`Uploaded file successfully: ${key} (${fileBuffer.length} bytes)`);

      return {
        file_url: fileUrl,
        file_path: key,
        file_size: fileBuffer.length,
      };
    } catch (err) {
      this.logger.error(`Error uploading to R2: ${err.message}`, err.stack);
      throw new BadRequestException('Gagal mengunggah berkas ke penyimpanan awan.');
    }
  }
}
