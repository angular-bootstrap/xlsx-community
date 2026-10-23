import * as XLSX from 'sheetjs-community-candidate';
const sheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ name: 'भारत', count: 42 }]);
const book: XLSX.WorkBook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(book, sheet, 'Data');
const rows: { name: string; count: number }[] = XLSX.utils.sheet_to_json<{ name: string; count: number }>(sheet);
const encoded: unknown = XLSX.write(book, { type: 'array', bookType: 'xlsx' });
const parsed: XLSX.WorkBook = XLSX.read(encoded, { type: 'array', cellDates: true });
const version: string = XLSX.version;
// @ts-expect-error Invalid input mode must be rejected, rather than erased to any.
const bad: XLSX.ParsingOptions = { type: 'not-supported' };
void [rows, parsed, version, bad];
