import { nanoid } from 'nanoid';

function generateId(prefix: string): string {
  return [prefix, nanoid(10)].join('_');
}

function generateArtistId(): string {
  return generateId('art');
}

function generateAlbumId(): string {
  return generateId('alb');
}
function generatePlaylistId(): string {
  return generateId('pl');
}

function generateTrackId(): string {
  return generateId('trk');
}

function generateMemberId(): string {
  return generateId('mbx');
}

function generateRoomId(): string {
  return generateId('rm');
}

export {
  generateId,
  generateArtistId,
  generateAlbumId,
  generateMemberId,
  generateTrackId,
  generateRoomId,
  generatePlaylistId,
};
