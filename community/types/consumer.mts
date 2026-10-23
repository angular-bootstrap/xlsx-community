import * as XLSX from 'sheetjs-community-candidate';
const sheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['भारत', 42]]);
const book: XLSX.WorkBook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(book, sheet, 'Data');
const output: unknown = XLSX.write(book, { type: 'array', bookType: 'xlsx' });
const read: XLSX.WorkBook = XLSX.read(output, { type: 'array' });
const values: unknown[][] = XLSX.utils.sheet_to_json<unknown[]>(read.Sheets.Data, { header: 1 });
// @ts-expect-error Invalid output mode must be rejected.
const bad: XLSX.WritingOptions = { type: 'not-supported' };
void [values, bad];
