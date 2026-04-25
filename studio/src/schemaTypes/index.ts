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
import place from './documents/place'
import jobListing from './documents/jobListing'
import jobSource from './documents/jobSource'
import jobFeed from './documents/jobFeed'
import crawlRun from './documents/crawlRun'
import country from './documents/country'
import city from './documents/city'
import company from './documents/company'
import companyCrawlRun from './documents/companyCrawlRun'
import geographySeedRun from './documents/geographySeedRun'

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

  // Jobs module
  place,
  jobListing,
  jobSource,
  jobFeed,
  crawlRun,

  // Countries & Companies module
  country,
  city,
  company,
  companyCrawlRun,
  geographySeedRun,
]
