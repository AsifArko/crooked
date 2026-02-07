import sourceCode from './documents/sourceCode'
import docFile from './documents/document'
import imageFile from './documents/image'
import settings from './singletons/settings'
import pageView from './documents/pageView'
import userEvent from './documents/userEvent'
import systemMetric from './documents/systemMetric'
import errorLog from './documents/errorLog'
import performanceMetric from './documents/performanceMetric'
import resumeDownload from './documents/resumeDownload'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,

  // Documents
  sourceCode,
  docFile,
  imageFile,

  // Analytics (system-generated, read-only)
  pageView,
  userEvent,
  systemMetric,
  errorLog,
  performanceMetric,
  resumeDownload,
]
