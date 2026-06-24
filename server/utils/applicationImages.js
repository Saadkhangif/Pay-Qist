import { uploadFileToBlob } from '../storage/blob.js';
import { isBlobStorageEnabled } from '../storage/blobClient.js';

export const APPLICATION_IMAGE_FIELDS = ['photo', 'idFront', 'idBack'];

function parseDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
  if (!match) {
    throw new Error('Invalid image data URL.');
  }

  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  };
}

function extensionForContentType(contentType) {
  const subtype = contentType.split('/')[1]?.toLowerCase() || 'jpg';
  if (subtype === 'jpeg') return 'jpg';
  return subtype.replace('+xml', '');
}

async function persistPersonImages(person, { applicationId, uploadedBy, role }) {
  const persisted = { ...person };

  await Promise.all(
    APPLICATION_IMAGE_FIELDS.map(async (field) => {
      const value = person[field];
      if (!value || !value.startsWith('data:image/')) {
        return;
      }

      const { contentType, buffer } = parseDataUrl(value);
      const upload = await uploadFileToBlob({
        buffer,
        contentType,
        filename: `${role}-${field}.${extensionForContentType(contentType)}`,
        folder: 'applications',
        access: 'private',
        uploadedBy,
        entityType: 'application',
        entityId: applicationId,
      });

      if (!upload.pathname) {
        throw new Error('Unable to store application image.');
      }

      persisted[field] = upload.pathname;
    }),
  );

  return persisted;
}

export async function persistApplicationImages(applicant, referral, { applicationId, uploadedBy }) {
  if (!isBlobStorageEnabled()) {
    return { applicant, referral };
  }

  const [persistedApplicant, persistedReferral] = await Promise.all([
    persistPersonImages(applicant, { applicationId, uploadedBy, role: 'applicant' }),
    persistPersonImages(referral, { applicationId, uploadedBy, role: 'referral' }),
  ]);

  return {
    applicant: persistedApplicant,
    referral: persistedReferral,
  };
}

export function resolvePersonImageUrls(person) {
  if (!person) {
    return person;
  }

  const resolved = { ...person };

  for (const field of APPLICATION_IMAGE_FIELDS) {
    const value = person[field];
    if (!value) {
      continue;
    }

    if (value.startsWith('data:image/') || value.startsWith('http')) {
      resolved[field] = value;
      continue;
    }

    if (value.startsWith('/api/blobs')) {
      resolved[field] = value;
      continue;
    }

    resolved[field] = `/api/blobs?pathname=${encodeURIComponent(value)}`;
  }

  return resolved;
}
