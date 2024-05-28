---- kalo error seperti ini :
 opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}
run :
export NODE_OPTIONS=--openssl-legacy-provider
lalu :
yarn start lagi
