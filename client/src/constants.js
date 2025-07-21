// console.log('xxx')
// const isProduction = import.meta.env.VITE_NODE_ENV === 'production'
// console.log('is production from constants file ---->', isProduction)
// export const BASE_URL = isProduction
//   ? 'https://socket-io-app-mern-deployed-production.up.railway.app'
//   : 'http://localhost:5001'

console.log('xxx')
const isProduction = import.meta.env.VITE_NODE_ENV === 'production'
console.log('is production from constants file ---->', isProduction)

export const BASE_URL = isProduction
  ? '' // Empty string - same domain, relative paths
  : 'http://localhost:5001' // Development - different port

console.log('BASE_URL:', BASE_URL)
