import { describe, expect, it } from 'vitest';
import { BACKUP_FORMAT, backupFileName, makeBackup, parseBackup, pickEntries } from '../src/lib/backup';

const now = new Date('2026-10-23T09:30:00Z');

describe('progress backups', () => {
  it('keeps only the site’s own keys, as stored', () => {
    const data = pickEntries([
      ['stockora-progress', '{"A/what-is-a-stock":1}'],
      ['stockora-theme', 'dark'],
      ['stockora-storage-test', '1'],
      ['other-site', 'x'],
    ]);
    expect(data).toEqual({ 'stockora-progress': '{"A/what-is-a-stock":1}', 'stockora-theme': 'dark' });
  });

  it('round-trips through a file', () => {
    const backup = makeBackup({ 'stockora-bookmarks': '[]', 'stockora-quiz-daily': '{"streak":3}' }, now);
    expect(backup.format).toBe(BACKUP_FORMAT);
    expect(backup.exported).toBe('2026-10-23T09:30:00.000Z');
    const parsed = parseBackup(JSON.stringify(backup));
    expect(parsed).toEqual({ ok: true, data: backup.data });
  });

  it('names the file by date', () => {
    expect(backupFileName(now)).toBe('stockora-progress-2026-10-23.json');
  });

  it('rejects files that are not Stockora backups', () => {
    expect(parseBackup('not json')).toEqual({ ok: false, error: 'invalid' });
    expect(parseBackup('{"format":"something-else","version":1,"data":{}}')).toEqual({ ok: false, error: 'invalid' });
    expect(parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 99, data: {} }))).toEqual({ ok: false, error: 'invalid' });
    expect(parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 1, data: { 'evil-key': 'x' } }))).toEqual({ ok: false, error: 'invalid' });
    expect(parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 1, data: { 'stockora-progress': 5 } }))).toEqual({ ok: false, error: 'invalid' });
  });

  it('reports an empty backup', () => {
    expect(parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 1, data: {} }))).toEqual({ ok: false, error: 'empty' });
  });
});
