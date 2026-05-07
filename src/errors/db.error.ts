export class DbError extends Error {
  constructor(
    public readonly type:
      | 'DUPLICATE_ENTRY'
      | 'FOREIGN_KEY'
      | 'NULL_CONSTRAINT'
      | 'DATA_TOO_LONG'
      | 'UNKNOWN',
    public readonly field: string,
    public readonly originalError?: unknown,
  ) {
    super(DbError.buildMessage(type, field));
    this.name = 'DbError';
  }

  private static buildMessage(type: DbError['type'], field: string): string {
    switch (type) {
      case 'DUPLICATE_ENTRY':   return `${field} already exists`;
      case 'FOREIGN_KEY':       return `Referenced ${field} does not exist`;
      case 'NULL_CONSTRAINT':   return `${field} cannot be null`;
      case 'DATA_TOO_LONG':     return `${field} value is too long`;
      default:                  return `Database error on field: ${field}`;
    }
  }

  get isDuplicate()    { return this.type === 'DUPLICATE_ENTRY'; }
  get isForeignKey()   { return this.type === 'FOREIGN_KEY'; }
  get isNullViolation(){ return this.type === 'NULL_CONSTRAINT'; }
}

const DB_ERROR_CODES: Record<string, DbError['type']> = {
  ER_DUP_ENTRY:          'DUPLICATE_ENTRY',
  ER_NO_REFERENCED_ROW:  'FOREIGN_KEY',
  ER_NO_REFERENCED_ROW_2:'FOREIGN_KEY',
  ER_ROW_IS_REFERENCED:  'FOREIGN_KEY',
  ER_ROW_IS_REFERENCED_2:'FOREIGN_KEY',
  ER_BAD_NULL_ERROR:     'NULL_CONSTRAINT',
  ER_DATA_TOO_LONG:      'DATA_TOO_LONG',
};

function extractField(message: string): string {
  return (
    message.match(/for key ['"`]?[\w.]*?\.?(\w+)['"`]?/i)?.[1] ??
    message.match(/Column ['"`](\w+)['"`] cannot be null/i)?.[1] ??
    message.match(/Data too long for column ['"`](\w+)['"`]/i)?.[1] ??
    message.match(/FOREIGN KEY \(`(\w+)`\)/i)?.[1] ??
    'unknown'
  );
}

export function handleDbError(err: unknown): never {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const { code, sqlMessage, message } = err as Record<string, string>;
    const type = DB_ERROR_CODES[code] ?? 'UNKNOWN';
    const field = extractField(sqlMessage ?? message ?? '');
    throw new DbError(type, field, err);
  }
  throw err;
}