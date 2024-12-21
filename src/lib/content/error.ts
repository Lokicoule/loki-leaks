export class ContentError extends Error {
  constructor(
    message: string,
    public code: ContentErrorCode,
  ) {
    super(message)
    this.name = 'ContentError'
  }
}

export type ContentErrorCode =
  | 'FILE_READ_ERROR'
  | 'VALIDATION_ERROR'
  | 'PATH_READ_ERROR'
  | 'RELATED_CONTENT_ERROR'
  | 'INVALID_DIRECTORY'
  | 'DIRECTORY_NOT_FOUND'
