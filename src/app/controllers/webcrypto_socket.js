/* eslint no-undef: 0 */
// import UUID from 'uuid';
import * as pkijs from 'pkijs';
import * as asn1js from 'asn1js';
import moment from 'moment';
import { CertHelper } from '../helpers';
import { SERVER_URL } from '../../../scripts/config';
import { OIDS } from '../constants';

export const ws = new WebcryptoSocket.SocketProvider();
window.ws = ws;

const subjectTypesAndValues = {
  commonName: '2.5.4.3',
  hostName: '1.3.6.1.2.1.1.5',
  organization: '2.5.4.10',
  organizationUnit: '2.5.4.11',
  country: '2.5.4.6',
  locality: '2.5.4.7',
  state: '2.5.4.8',
};

const subjectNames = {
  O: 'organization',
  CN: 'commonName',
  C: 'country',
  OU: 'organizationUnit',
  L: 'city',
  ST: 'region',
  E: 'email',
  '1.3.6.1.2.1.1.5': 'hostName',
};

export const WSController = {
  connect: function connect(onListening, onError, onClose, onToken) {
    ws.connect(SERVER_URL)
      .on('error', onError)
      .on('listening', onListening)
      .on('close', onClose)
      .on('token', onToken);
  },

  decoratePkcs10Subject: function decoratePkcs10Subject(pkcs10, data) {
    Object.keys(data).map((key) => {
      if ({}.hasOwnProperty.call(subjectTypesAndValues, key)) {
        pkcs10.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: new asn1js.Utf8String({ value: data[key] }),
        }));
      }
      return true;
    });
    return pkcs10;
  },

  keyDataHandler: function keyDataHandler(keyData, keyId) {
    const { algorithm, usages, id } = keyData;
    return {
      id,
      _id: keyId,
      algorithm: algorithm.name,
      usages,
      name: '',
      size: (algorithm.modulusLength || algorithm.namedCurve).toString(),
      createdAt: '',
      lastUsed: '',
      type: 'key',
    };
  },

  certDataHandler: function certDataHandler(certDetails, certData, certId) {
    const lang = navigator.language;
    const { id } = certData;
    const {
      issuerName,
      subjectName,
      extensions,
      publicKey,
      version,
      signature,
      serialNumber,
      notBefore,
      notAfter,
    } = certDetails;
    const decodedIssuer = this.decodeSubjectString(issuerName);
    const decodedSubject = this.decodeSubjectString(subjectName);
    return {
      id,
      _id: certId,
      type: 'certificate',
      name: decodedSubject.name || '',
      serialNumber,
      extensions,
      publicKey,
      version,
      signature,
      publicKeyInfo: {
        algorithm: signature.algorithm.name,
        modulusBits: publicKey.algorithm.modulusBits,
        namedCurve: publicKey.algorithm.namedCurve,
      },
      issuer: decodedIssuer,
      subject: decodedSubject,
      notBefore: notBefore ? moment(notBefore).locale(lang).format('LLLL') : '',
      notAfter: notAfter ? moment(notAfter).locale(lang).format('LLLL') : '',
    };
  },

  requestDataHandler: function requestDataHandler(reqData, reqId) {
    const { publicKey, id, subjectName } = reqData;
    const decodedSubject = this.decodeSubjectString(subjectName);
    return Object.assign({
      id,
      _id: reqId,
      name: '',
      type: 'request',
      publicKeyInfo: {
        modulusBits: publicKey.algorithm.modulusLength,
        namedCurve: publicKey.algorithm.namedCurve,
        type: CertHelper.getKeyType(publicKey.algorithm.name),
        publicExponent: publicKey.algorithm.publicExponent.byteLength === 3 ? '65537' : '3',
        algorithm: publicKey.algorithm.name,
        value: CertHelper.addSpaceAfterSecondCharset(new Buffer(publicKey.raw).toString('hex')),
      },
      signature: {
        algorithm: publicKey.algorithm.name,
        hash: publicKey.algorithm.hash.name,
      },
      commonName: '',
      organization: '',
      organizationUnit: '',
      country: '',
      region: '',
      city: '',
    }, decodedSubject);
  },

  decodeSubjectString: function decodeSubjectString(subjectString) {
    const subjectObj = {};
    const arrSubjects = subjectString.split(/, /g);
    arrSubjects.map((sbj) => {
      const arrSubject = sbj.split('=');
      const subjectName = subjectNames[arrSubject[0]] || OIDS[arrSubject[0]] || arrSubject[0];
      const subjectValue = arrSubject[1];
      subjectObj[subjectName] = subjectValue;
      if (subjectName === 'commonName') {
        subjectObj.name = subjectValue;
      }
      return true;
    });
    return subjectObj;
  },
};
