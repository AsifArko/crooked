import sourceCode from './documents/sourceCode'
import docFile from './documents/document'
import imageFile from './documents/image'
import settings from './singletons/settings'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  sourceCode,
  docFile,
  imageFile,
]
