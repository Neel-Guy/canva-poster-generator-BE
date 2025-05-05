const crypto = require('crypto');
const codeVerifier = crypto.randomBytes(96).toString('base64url');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// code challenge and verifier string need to be unique per request

const api = `https://www.canva.com/api/oauth/authorize?code_challenge_method=s256&response_type=code&client_id=OC-AZaLUwfwu9ix&scope=design:content:read%20design:meta:read%20design:content:write%20folder:read%20asset:read%20asset:write%20brandtemplate:meta:read%20brandtemplate:content:read%20profile:read&code_challenge=${codeChallenge}`;
// https://www.canva.com/api/oauth/authorize?code_challenge_method=s256&response_type=code&client_id=OC-AZaLUwfwu9ix&scope=design:content:read%20design:meta:read%20design:content:write%20folder:read%20asset:read%20asset:write%20brandtemplate:meta:read%20brandtemplate:content:read%20profile:read&code_challenge=U8-sG36GvwsbeHqOfUZYKYSb4R-0aMjlcGR44MDGH4s
console.log('codeChallenge', codeChallenge);
console.log('codeVerifier', codeVerifier);
