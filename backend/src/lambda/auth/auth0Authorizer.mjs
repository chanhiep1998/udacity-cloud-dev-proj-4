import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'
import { JwksClient } from 'jwks-rsa'
const logger = createLogger('auth')

const jwksUrl = 'https://dev-j4ueo7uoacswwnbr.us.auth0.com/.well-known/jwks.json'

var client = new JwksClient({
    jwksUri: jwksUrl
});
export async function handler(event) {
    logger.info('Process Auth event', event)

    try {
        const jwtToken = await verifyToken(event.authorizationToken)
        logger.info('User was authorized', { token: jwtToken })

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        logger.error('User not authorized', { error: e.message })

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

async function verifyToken(authHeader) {
    const token = getToken(authHeader)
    const jwt = jsonwebtoken.decode(token, { complete: true })
    const key = await getKey(jwt.header.kid)
    const decoded = jsonwebtoken.verify(token, key, { complete: false })
    return decoded
}

async function getKey(kid) {
    const key = await client.getSigningKey(kid)
    let signingKey = key.publicKey || key.rsaPublicKey
    return signingKey
}

function getToken(authHeader) {
    if (!authHeader) throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return token
}
