/*! ***** BEGIN LICENSE BLOCK *****
 *!
 *! Copyright 2011-2012, 2014 Jean-Christophe Sirot <sirot@chelonix.com>
 *!
 *! This file is part of digest.js
 *!
 *! digest.js is free software: you can redistribute it and/or modify it under
 *! the terms of the GNU General Public License as published by the Free Software
 *! Foundation, either version 3 of the License, or (at your option) any later
 *! version.
 *!
 *! digest.js is distributed in the hope that it will be useful, but
 *! WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 *! or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 *! more details.
 *!
 *! You should have received a copy of the GNU General Public License along with
 *! digest.js. If not, see http://www.gnu.org/licenses/.
 *!
 *! ***** END LICENSE BLOCK *****  */

/*global ArrayBuffer: true, Uint8Array: true, Uint32Array:true */
/*jslint browser: true, bitwise: true, plusplus: true, vars: true, indent: 4, maxerr: 50 */


(function () {
    "use strict";
    if (!ArrayBuffer.prototype.slice) {
        ArrayBuffer.prototype.slice = function (start, end) {
            var i;
            var that = new Uint8Array(this);
            if (end === undefined) {
                end = that.length;
            }
            var result = new ArrayBuffer(end - start);
            var resultArray = new Uint8Array(result);
            for (i = 0; i < resultArray.length; i++) {
                resultArray[i] = that[i + start];
            }
            return result;
        };
    }
}());


;(function (global) {
    "use strict";

    /* MD5 */

    function md5Engine() {}

    md5Engine.prototype.processBlock = function (input) {

        var A = this.current[0];
        var B = this.current[1];
        var C = this.current[2];
        var D = this.current[3];
        var T0;

        var W0 = input[3] << 24 | input[2] << 16 | input[1] << 8 | input[0];
        var W1 = input[7] << 24 | input[6] << 16 | input[5] << 8 | input[4];
        var W2 = input[11] << 24 | input[10] << 16 | input[9] << 8 | input[8];
        var W3 = input[15] << 24 | input[14] << 16 | input[13] << 8 | input[12];
        var W4 = input[19] << 24 | input[18] << 16 | input[17] << 8 | input[16];
        var W5 = input[23] << 24 | input[22] << 16 | input[21] << 8 | input[20];
        var W6 = input[27] << 24 | input[26] << 16 | input[25] << 8 | input[24];
        var W7 = input[31] << 24 | input[30] << 16 | input[29] << 8 | input[28];
        var W8 = input[35] << 24 | input[34] << 16 | input[33] << 8 | input[32];
        var W9 = input[39] << 24 | input[38] << 16 | input[37] << 8 | input[36];
        var Wa = input[43] << 24 | input[42] << 16 | input[41] << 8 | input[40];
        var Wb = input[47] << 24 | input[46] << 16 | input[45] << 8 | input[44];
        var Wc = input[51] << 24 | input[50] << 16 | input[49] << 8 | input[48];
        var Wd = input[55] << 24 | input[54] << 16 | input[53] << 8 | input[52];
        var We = input[59] << 24 | input[58] << 16 | input[57] << 8 | input[56];
        var Wf = input[63] << 24 | input[62] << 16 | input[61] << 8 | input[60];

        T0 = A + W0 + 0xd76aa478 + ((B & C) | (~B & D)) | 0;
        A = B + (((T0) << 7) | ((T0) >>> 25)) | 0;
        T0 = D + W1 + 0xe8c7b756 + ((A & B) | (~A & C)) | 0;
        D = A + (((T0) << 12) | ((T0) >>> 20)) | 0;
        T0 = C + W2 + 0x242070db + ((D & A) | (~D & B)) | 0;
        C = D + (((T0) << 17) | ((T0) >>> 15)) | 0;
        T0 = B + W3 + 0xc1bdceee + ((C & D) | (~C & A)) | 0;
        B = C + (((T0) << 22) | ((T0) >>> 10)) | 0;
        T0 = A + W4 + 0xf57c0faf + ((B & C) | (~B & D)) | 0;
        A = B + (((T0) << 7) | ((T0) >>> 25)) | 0;
        T0 = D + W5 + 0x4787c62a + ((A & B) | (~A & C)) | 0;
        D = A + (((T0) << 12) | ((T0) >>> 20)) | 0;
        T0 = C + W6 + 0xa8304613 + ((D & A) | (~D & B)) | 0;
        C = D + (((T0) << 17) | ((T0) >>> 15)) | 0;
        T0 = B + W7 + 0xfd469501 + ((C & D) | (~C & A)) | 0;
        B = C + (((T0) << 22) | ((T0) >>> 10)) | 0;
        T0 = A + W8 + 0x698098d8 + ((B & C) | (~B & D)) | 0;
        A = B + (((T0) << 7) | ((T0) >>> 25)) | 0;
        T0 = D + W9 + 0x8b44f7af + ((A & B) | (~A & C)) | 0;
        D = A + (((T0) << 12) | ((T0) >>> 20)) | 0;
        T0 = C + Wa + 0xffff5bb1 + ((D & A) | (~D & B)) | 0;
        C = D + (((T0) << 17) | ((T0) >>> 15)) | 0;
        T0 = B + Wb + 0x895cd7be + ((C & D) | (~C & A)) | 0;
        B = C + (((T0) << 22) | ((T0) >>> 10)) | 0;
        T0 = A + Wc + 0x6b901122 + ((B & C) | (~B & D)) | 0;
        A = B + (((T0) << 7) | ((T0) >>> 25)) | 0;
        T0 = D + Wd + 0xfd987193 + ((A & B) | (~A & C)) | 0;
        D = A + (((T0) << 12) | ((T0) >>> 20)) | 0;
        T0 = C + We + 0xa679438e + ((D & A) | (~D & B)) | 0;
        C = D + (((T0) << 17) | ((T0) >>> 15)) | 0;
        T0 = B + Wf + 0x49b40821 + ((C & D) | (~C & A)) | 0;
        B = C + (((T0) << 22) | ((T0) >>> 10)) | 0;
        T0 = A + W1 + 0xf61e2562 + ((D & B) | (~D & C)) | 0;
        A = B + (((T0) << 5) | ((T0) >>> 27)) | 0;
        T0 = D + W6 + 0xc040b340 + ((C & A) | (~C & B)) | 0;
        D = A + (((T0) << 9) | ((T0) >>> 23)) | 0;
        T0 = C + Wb + 0x265e5a51 + ((B & D) | (~B & A)) | 0;
        C = D + (((T0) << 14) | ((T0) >>> 18)) | 0;
        T0 = B + W0 + 0xe9b6c7aa + ((A & C) | (~A & D)) | 0;
        B = C + (((T0) << 20) | ((T0) >>> 12)) | 0;
        T0 = A + W5 + 0xd62f105d + ((D & B) | (~D & C)) | 0;
        A = B + (((T0) << 5) | ((T0) >>> 27)) | 0;
        T0 = D + Wa + 0x2441453 + ((C & A) | (~C & B)) | 0;
        D = A + (((T0) << 9) | ((T0) >>> 23)) | 0;
        T0 = C + Wf + 0xd8a1e681 + ((B & D) | (~B & A)) | 0;
        C = D + (((T0) << 14) | ((T0) >>> 18)) | 0;
        T0 = B + W4 + 0xe7d3fbc8 + ((A & C) | (~A & D)) | 0;
        B = C + (((T0) << 20) | ((T0) >>> 12)) | 0;
        T0 = A + W9 + 0x21e1cde6 + ((D & B) | (~D & C)) | 0;
        A = B + (((T0) << 5) | ((T0) >>> 27)) | 0;
        T0 = D + We + 0xc33707d6 + ((C & A) | (~C & B)) | 0;
        D = A + (((T0) << 9) | ((T0) >>> 23)) | 0;
        T0 = C + W3 + 0xf4d50d87 + ((B & D) | (~B & A)) | 0;
        C = D + (((T0) << 14) | ((T0) >>> 18)) | 0;
        T0 = B + W8 + 0x455a14ed + ((A & C) | (~A & D)) | 0;
        B = C + (((T0) << 20) | ((T0) >>> 12)) | 0;
        T0 = A + Wd + 0xa9e3e905 + ((D & B) | (~D & C)) | 0;
        A = B + (((T0) << 5) | ((T0) >>> 27)) | 0;
        T0 = D + W2 + 0xfcefa3f8 + ((C & A) | (~C & B)) | 0;
        D = A + (((T0) << 9) | ((T0) >>> 23)) | 0;
        T0 = C + W7 + 0x676f02d9 + ((B & D) | (~B & A)) | 0;
        C = D + (((T0) << 14) | ((T0) >>> 18)) | 0;
        T0 = B + Wc + 0x8d2a4c8a + ((A & C) | (~A & D)) | 0;
        B = C + (((T0) << 20) | ((T0) >>> 12)) | 0;
        T0 = A + W5 + 0xfffa3942 + (B ^ C ^ D) | 0;
        A = B + (((T0) << 4) | ((T0) >>> 28)) | 0;
        T0 = D + W8 + 0x8771f681 + (A ^ B ^ C) | 0;
        D = A + (((T0) << 11) | ((T0) >>> 21)) | 0;
        T0 = C + Wb + 0x6d9d6122 + (D ^ A ^ B) | 0;
        C = D + (((T0) << 16) | ((T0) >>> 16)) | 0;
        T0 = B + We + 0xfde5380c + (C ^ D ^ A) | 0;
        B = C + (((T0) << 23) | ((T0) >>> 9)) | 0;
        T0 = A + W1 + 0xa4beea44 + (B ^ C ^ D) | 0;
        A = B + (((T0) << 4) | ((T0) >>> 28)) | 0;
        T0 = D + W4 + 0x4bdecfa9 + (A ^ B ^ C) | 0;
        D = A + (((T0) << 11) | ((T0) >>> 21)) | 0;
        T0 = C + W7 + 0xf6bb4b60 + (D ^ A ^ B) | 0;
        C = D + (((T0) << 16) | ((T0) >>> 16)) | 0;
        T0 = B + Wa + 0xbebfbc70 + (C ^ D ^ A) | 0;
        B = C + (((T0) << 23) | ((T0) >>> 9)) | 0;
        T0 = A + Wd + 0x289b7ec6 + (B ^ C ^ D) | 0;
        A = B + (((T0) << 4) | ((T0) >>> 28)) | 0;
        T0 = D + W0 + 0xeaa127fa + (A ^ B ^ C) | 0;
        D = A + (((T0) << 11) | ((T0) >>> 21)) | 0;
        T0 = C + W3 + 0xd4ef3085 + (D ^ A ^ B) | 0;
        C = D + (((T0) << 16) | ((T0) >>> 16)) | 0;
        T0 = B + W6 + 0x4881d05 + (C ^ D ^ A) | 0;
        B = C + (((T0) << 23) | ((T0) >>> 9)) | 0;
        T0 = A + W9 + 0xd9d4d039 + (B ^ C ^ D) | 0;
        A = B + (((T0) << 4) | ((T0) >>> 28)) | 0;
        T0 = D + Wc + 0xe6db99e5 + (A ^ B ^ C) | 0;
        D = A + (((T0) << 11) | ((T0) >>> 21)) | 0;
        T0 = C + Wf + 0x1fa27cf8 + (D ^ A ^ B) | 0;
        C = D + (((T0) << 16) | ((T0) >>> 16)) | 0;
        T0 = B + W2 + 0xc4ac5665 + (C ^ D ^ A) | 0;
        B = C + (((T0) << 23) | ((T0) >>> 9)) | 0;
        T0 = A + W0 + 0xf4292244 + (C ^ (B | ~D)) | 0;
        A = B + (((T0) << 6) | ((T0) >>> 26)) | 0;
        T0 = D + W7 + 0x432aff97 + (B ^ (A | ~C)) | 0;
        D = A + (((T0) << 10) | ((T0) >>> 22)) | 0;
        T0 = C + We + 0xab9423a7 + (A ^ (D | ~B)) | 0;
        C = D + (((T0) << 15) | ((T0) >>> 17)) | 0;
        T0 = B + W5 + 0xfc93a039 + (D ^ (C | ~A)) | 0;
        B = C + (((T0) << 21) | ((T0) >>> 11)) | 0;
        T0 = A + Wc + 0x655b59c3 + (C ^ (B | ~D)) | 0;
        A = B + (((T0) << 6) | ((T0) >>> 26)) | 0;
        T0 = D + W3 + 0x8f0ccc92 + (B ^ (A | ~C)) | 0;
        D = A + (((T0) << 10) | ((T0) >>> 22)) | 0;
        T0 = C + Wa + 0xffeff47d + (A ^ (D | ~B)) | 0;
        C = D + (((T0) << 15) | ((T0) >>> 17)) | 0;
        T0 = B + W1 + 0x85845dd1 + (D ^ (C | ~A)) | 0;
        B = C + (((T0) << 21) | ((T0) >>> 11)) | 0;
        T0 = A + W8 + 0x6fa87e4f + (C ^ (B | ~D)) | 0;
        A = B + (((T0) << 6) | ((T0) >>> 26)) | 0;
        T0 = D + Wf + 0xfe2ce6e0 + (B ^ (A | ~C)) | 0;
        D = A + (((T0) << 10) | ((T0) >>> 22)) | 0;
        T0 = C + W6 + 0xa3014314 + (A ^ (D | ~B)) | 0;
        C = D + (((T0) << 15) | ((T0) >>> 17)) | 0;
        T0 = B + Wd + 0x4e0811a1 + (D ^ (C | ~A)) | 0;
        B = C + (((T0) << 21) | ((T0) >>> 11)) | 0;
        T0 = A + W4 + 0xf7537e82 + (C ^ (B | ~D)) | 0;
        A = B + (((T0) << 6) | ((T0) >>> 26)) | 0;
        T0 = D + Wb + 0xbd3af235 + (B ^ (A | ~C)) | 0;
        D = A + (((T0) << 10) | ((T0) >>> 22)) | 0;
        T0 = C + W2 + 0x2ad7d2bb + (A ^ (D | ~B)) | 0;
        C = D + (((T0) << 15) | ((T0) >>> 17)) | 0;
        T0 = B + W9 + 0xeb86d391 + (D ^ (C | ~A)) | 0;
        B = C + (((T0) << 21) | ((T0) >>> 11)) | 0;

        this.current[0] += A;
        this.current[1] += B;
        this.current[2] += C;
        this.current[3] += D;
        this.currentLen += 64;
    };

    md5Engine.prototype.doPadding = function () {
        var datalen = (this.inLen + this.currentLen) * 8;
        var msw = 0; // FIXME
        var lsw = datalen & 0xFFFFFFFF;
        var zeros = this.inLen <= 55 ? 55 - this.inLen : 119 - this.inLen;
        var pad = new Uint8Array(new ArrayBuffer(zeros + 1 + 8));
        pad[0] = 0x80;
        pad[pad.length - 8] = lsw & 0xFF;
        pad[pad.length - 7] = (lsw >>> 8) & 0xFF;
        pad[pad.length - 6] = (lsw >>> 16) & 0xFF;
        pad[pad.length - 5] = (lsw >>> 24) & 0xFF;
        pad[pad.length - 4] = msw & 0xFF;
        pad[pad.length - 3] = (msw >>> 8) & 0xFF;
        pad[pad.length - 2] = (msw >>> 16) & 0xFF;
        pad[pad.length - 1] = (msw >>> 24) & 0xFF;
        return pad;
    };

    md5Engine.prototype.getDigest = function () {
        var rv = new Uint8Array(new ArrayBuffer(16));
        rv[0] = this.current[0] & 0xFF;
        rv[1] = (this.current[0] >>> 8) & 0xFF;
        rv[2] = (this.current[0] >>> 16) & 0xFF;
        rv[3] = (this.current[0] >>> 24) & 0xFF;
        rv[4] = this.current[1] & 0xFF;
        rv[5] = (this.current[1] >>> 8) & 0xFF;
        rv[6] = (this.current[1] >>> 16) & 0xFF;
        rv[7] = (this.current[1] >>> 24) & 0xFF;
        rv[8] = this.current[2] & 0xFF;
        rv[9] = (this.current[2] >>> 8) & 0xFF;
        rv[10] = (this.current[2] >>> 16) & 0xFF;
        rv[11] = (this.current[2] >>> 24) & 0xFF;
        rv[12] = this.current[3] & 0xFF;
        rv[13] = (this.current[3] >>> 8) & 0xFF;
        rv[14] = (this.current[3] >>> 16) & 0xFF;
        rv[15] = (this.current[3] >>> 24) & 0xFF;
        return rv.buffer;
    };

    md5Engine.prototype.reset = function () {
        this.currentLen = 0;
        this.inLen = 0;
        this.current = new Uint32Array(new ArrayBuffer(16));
        this.current[0] = 0x67452301;
        this.current[1] = 0xEFCDAB89;
        this.current[2] = 0x98BADCFE;
        this.current[3] = 0x10325476;
    };

    md5Engine.prototype.blockLen = 64;
    md5Engine.prototype.digestLen = 16;

    /* SHA-1 */

    function sha1Engine() {}

    sha1Engine.prototype.processBlock = function (input) {

        var A = this.current[0];
        var B = this.current[1];
        var C = this.current[2];
        var D = this.current[3];
        var E = this.current[4];

        var W = [ 
            input[0] << 24 | input[1] << 16 | input[2] << 8 | input[3],
            input[4] << 24 | input[5] << 16 | input[6] << 8 | input[7],
            input[8] << 24 | input[9] << 16 | input[10] << 8 | input[11],
            input[12] << 24 | input[13] << 16 | input[14] << 8 | input[15],
            input[16] << 24 | input[17] << 16 | input[18] << 8 | input[19],
            input[20] << 24 | input[21] << 16 | input[22] << 8 | input[23],
            input[24] << 24 | input[25] << 16 | input[26] << 8 | input[27],
            input[28] << 24 | input[29] << 16 | input[30] << 8 | input[31],
            input[32] << 24 | input[33] << 16 | input[34] << 8 | input[35],
            input[36] << 24 | input[37] << 16 | input[38] << 8 | input[39],
            input[40] << 24 | input[41] << 16 | input[42] << 8 | input[43],
            input[44] << 24 | input[45] << 16 | input[46] << 8 | input[47],
            input[48] << 24 | input[49] << 16 | input[50] << 8 | input[51],
            input[52] << 24 | input[53] << 16 | input[54] << 8 | input[55],
            input[56] << 24 | input[57] << 16 | input[58] << 8 | input[59],
            input[60] << 24 | input[61] << 16 | input[62] << 8 | input[63]
        ];
        var T;
        var i;

        for (i = 16; i < 80; i++) {
            W.push((((W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16]) << 1) | ((W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16]) >>> 31)));
        }

        for (i = 0; i < 80; i++) {
            T = ((A << 5) | (A >>> 27)) + E + W[i];
            if (i < 20) {
                T += ((B & C) | (~B & D)) + 0x5A827999 | 0;
            } else if (i < 40) {
                T += (B ^ C ^ D) + 0x6ED9EBA1 | 0;
            } else if (i < 60) {
                T += ((B & C) | (B & D) | (C & D)) + 0x8F1BBCDC| 0;
            } else {
                T += (B ^ C ^ D) + 0xCA62C1D6 | 0;
            }
            E = D;
            D = C;
            C = ((B << 30) | (B >>> 2));
            B = A;
            A = T;
        }

        this.current[0] += A;
        this.current[1] += B;
        this.current[2] += C;
        this.current[3] += D;
        this.current[4] += E;
        this.currentLen += 64;
    };

    sha1Engine.prototype.doPadding = function () {
        var datalen = (this.inLen + this.currentLen) * 8;
        var msw = 0; // FIXME
        var lsw = datalen & 0xFFFFFFFF;
        var zeros = this.inLen <= 55 ? 55 - this.inLen : 119 - this.inLen;
        var pad = new Uint8Array(new ArrayBuffer(zeros + 1 + 8));
        pad[0] = 0x80;
        pad[pad.length - 1] = lsw & 0xFF;
        pad[pad.length - 2] = (lsw >>> 8) & 0xFF;
        pad[pad.length - 3] = (lsw >>> 16) & 0xFF;
        pad[pad.length - 4] = (lsw >>> 24) & 0xFF;
        pad[pad.length - 5] = msw & 0xFF;
        pad[pad.length - 6] = (msw >>> 8) & 0xFF;
        pad[pad.length - 7] = (msw >>> 16) & 0xFF;
        pad[pad.length - 8] = (msw >>> 24) & 0xFF;
        return pad;
    };

    sha1Engine.prototype.getDigest = function () {
        var rv = new Uint8Array(new ArrayBuffer(20));
        rv[3] = this.current[0] & 0xFF;
        rv[2] = (this.current[0] >>> 8) & 0xFF;
        rv[1] = (this.current[0] >>> 16) & 0xFF;
        rv[0] = (this.current[0] >>> 24) & 0xFF;
        rv[7] = this.current[1] & 0xFF;
        rv[6] = (this.current[1] >>> 8) & 0xFF;
        rv[5] = (this.current[1] >>> 16) & 0xFF;
        rv[4] = (this.current[1] >>> 24) & 0xFF;
        rv[11] = this.current[2] & 0xFF;
        rv[10] = (this.current[2] >>> 8) & 0xFF;
        rv[9] = (this.current[2] >>> 16) & 0xFF;
        rv[8] = (this.current[2] >>> 24) & 0xFF;
        rv[15] = this.current[3] & 0xFF;
        rv[14] = (this.current[3] >>> 8) & 0xFF;
        rv[13] = (this.current[3] >>> 16) & 0xFF;
        rv[12] = (this.current[3] >>> 24) & 0xFF;
        rv[19] = this.current[4] & 0xFF;
        rv[18] = (this.current[4] >>> 8) & 0xFF;
        rv[17] = (this.current[4] >>> 16) & 0xFF;
        rv[16] = (this.current[4] >>> 24) & 0xFF;
        return rv.buffer;
    };

    sha1Engine.prototype.reset = function () {
        this.currentLen = 0;
        this.inLen = 0;
        this.current = new Uint32Array(new ArrayBuffer(20));
        this.current[0] = 0x67452301;
        this.current[1] = 0xEFCDAB89;
        this.current[2] = 0x98BADCFE;
        this.current[3] = 0x10325476;
        this.current[4] = 0xC3D2E1F0;
    };

    sha1Engine.prototype.blockLen = 64;
    sha1Engine.prototype.digestLen = 20;

    /* SHA-256 */

    function sha256Engine() {}

    sha256Engine.prototype.processBlock = function (input) {

        var A = this.current[0];
        var B = this.current[1];
        var C = this.current[2];
        var D = this.current[3];
        var E = this.current[4];
        var F = this.current[5];
        var G = this.current[6];
        var H = this.current[7];
        var T1, T2;
        var W0, W1, W2, W3, W4, W5, W6, W7;
        var W8, W9, Wa, Wb, Wc, Wd, We, Wf;

        W0 = input[0] << 24 | input[1] << 16 | input[2] << 8 | input[3];
        W1 = input[4] << 24 | input[5] << 16 | input[6] << 8 | input[7];
        W2 = input[8] << 24 | input[9] << 16 | input[10] << 8 | input[11];
        W3 = input[12] << 24 | input[13] << 16 | input[14] << 8 | input[15];
        W4 = input[16] << 24 | input[17] << 16 | input[18] << 8 | input[19];
        W5 = input[20] << 24 | input[21] << 16 | input[22] << 8 | input[23];
        W6 = input[24] << 24 | input[25] << 16 | input[26] << 8 | input[27];
        W7 = input[28] << 24 | input[29] << 16 | input[30] << 8 | input[31];
        W8 = input[32] << 24 | input[33] << 16 | input[34] << 8 | input[35];
        W9 = input[36] << 24 | input[37] << 16 | input[38] << 8 | input[39];
        Wa = input[40] << 24 | input[41] << 16 | input[42] << 8 | input[43];
        Wb = input[44] << 24 | input[45] << 16 | input[46] << 8 | input[47];
        Wc = input[48] << 24 | input[49] << 16 | input[50] << 8 | input[51];
        Wd = input[52] << 24 | input[53] << 16 | input[54] << 8 | input[55];
        We = input[56] << 24 | input[57] << 16 | input[58] << 8 | input[59];
        Wf = input[60] << 24 | input[61] << 16 | input[62] << 8 | input[63];

        var W = [W0, W1, W2, W3, W4, W5, W6, W7, W8, W9, Wa, Wb, Wc, Wd, We, Wf];
        for (var i = 16; i < 64; i++) {
            W.push((((W[i-2] >>> 17) | (W[i-2] << 15)) ^ ((W[i-2] >>> 19) | (W[i-2] << 13)) ^ (W[i-2] >>> 10)) + W[i-7] + (((W[i-15] >>> 7) | (W[i-15] << 25)) ^ ((W[i-15] >>> 18) | (W[i-15] << 14)) ^ (W[i-15] >>> 3)) + W[i-16] | 0);
        }

        var K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];

        for (var r = 0; r < 64; r++) {
            T1 = H + (((E >>> 6) | (E << 26)) ^ ((E >>> 11) | (E << 21)) ^ ((E >>> 25) | (E << 7))) + ((E & F) ^ (~E & G)) + K[r] + W[r] | 0;
            T2 = (((A >>> 2) | (A << 30)) ^ ((A >>> 13) | (A << 19)) ^ ((A >>> 22) | (A << 10))) + ((A & B) ^ (B & C) ^ (A & C)) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
        }

        this.current[0] += A;
        this.current[1] += B;
        this.current[2] += C;
        this.current[3] += D;
        this.current[4] += E;
        this.current[5] += F;
        this.current[6] += G;
        this.current[7] += H;
        this.currentLen += 64;
    };

    sha256Engine.prototype.doPadding = function () {
        var datalen = (this.inLen + this.currentLen) * 8;
        var msw = 0; // FIXME
        var lsw = datalen | 0;
        var zeros = this.inLen <= 55 ? 55 - this.inLen : 119 - this.inLen;
        var pad = new Uint8Array(new ArrayBuffer(zeros + 1 + 8));
        pad[0] = 0x80;
        pad[pad.length - 1] = lsw & 0xFF;
        pad[pad.length - 2] = (lsw >>> 8) & 0xFF;
        pad[pad.length - 3] = (lsw >>> 16) & 0xFF;
        pad[pad.length - 4] = (lsw >>> 24) & 0xFF;
        pad[pad.length - 5] = msw & 0xFF;
        pad[pad.length - 6] = (msw >>> 8) & 0xFF;
        pad[pad.length - 7] = (msw >>> 16) & 0xFF;
        pad[pad.length - 8] = (msw >>> 24) & 0xFF;
        return pad;
    };

    sha256Engine.prototype.getDigest = function () {
        var rv = new Uint8Array(new ArrayBuffer(32));
        rv[3] = this.current[0] & 0xFF;
        rv[2] = (this.current[0] >>> 8) & 0xFF;
        rv[1] = (this.current[0] >>> 16) & 0xFF;
        rv[0] = (this.current[0] >>> 24) & 0xFF;
        rv[7] = this.current[1] & 0xFF;
        rv[6] = (this.current[1] >>> 8) & 0xFF;
        rv[5] = (this.current[1] >>> 16) & 0xFF;
        rv[4] = (this.current[1] >>> 24) & 0xFF;
        rv[11] = this.current[2] & 0xFF;
        rv[10] = (this.current[2] >>> 8) & 0xFF;
        rv[9] = (this.current[2] >>> 16) & 0xFF;
        rv[8] = (this.current[2] >>> 24) & 0xFF;
        rv[15] = this.current[3] & 0xFF;
        rv[14] = (this.current[3] >>> 8) & 0xFF;
        rv[13] = (this.current[3] >>> 16) & 0xFF;
        rv[12] = (this.current[3] >>> 24) & 0xFF;
        rv[19] = this.current[4] & 0xFF;
        rv[18] = (this.current[4] >>> 8) & 0xFF;
        rv[17] = (this.current[4] >>> 16) & 0xFF;
        rv[16] = (this.current[4] >>> 24) & 0xFF;
        rv[23] = this.current[5] & 0xFF;
        rv[22] = (this.current[5] >>> 8) & 0xFF;
        rv[21] = (this.current[5] >>> 16) & 0xFF;
        rv[20] = (this.current[5] >>> 24) & 0xFF;
        rv[27] = this.current[6] & 0xFF;
        rv[26] = (this.current[6] >>> 8) & 0xFF;
        rv[25] = (this.current[6] >>> 16) & 0xFF;
        rv[24] = (this.current[6] >>> 24) & 0xFF;
        rv[31] = this.current[7] & 0xFF;
        rv[30] = (this.current[7] >>> 8) & 0xFF;
        rv[29] = (this.current[7] >>> 16) & 0xFF;
        rv[28] = (this.current[7] >>> 24) & 0xFF;
        return rv.buffer;
    };

    sha256Engine.prototype.reset = function () {
        this.currentLen = 0;
        this.inLen = 0;
        this.current = new Uint32Array(new ArrayBuffer(32));
        this.current[0] = 0x6A09E667;
        this.current[1] = 0xBB67AE85;
        this.current[2] = 0x3C6EF372;
        this.current[3] = 0xA54FF53A;
        this.current[4] = 0x510E527F;
        this.current[5] = 0x9B05688C;
        this.current[6] = 0x1F83D9AB;
        this.current[7] = 0x5BE0CD19;
    };

    sha256Engine.prototype.blockLen = 64;
    sha256Engine.prototype.digestLen = 32;

    /* Input utility functions */

    var fromASCII = function (s) {
        var buffer = new ArrayBuffer(s.length);
        var b = new Uint8Array(buffer);
        var i;
        for (i = 0; i < s.length; i++) {
            b[i] = s.charCodeAt(i);
        }
        return b;
    };

    var fromInteger = function (v) {
        var buffer = new ArrayBuffer(1);
        var b = new Uint8Array(buffer);
        b[0] = v;
        return b;
    };

    var convertToUint8Array = function (input) {
        if (input.constructor === Uint8Array) {
            return input;
        } else if (input.constructor === ArrayBuffer) {
            return new Uint8Array(input);
        } else if (input.constructor === String) {
            return fromASCII(input);
        } else if (input.constructor === Number) {
            if (input > 0xFF) {
                throw "For more than one byte, use an array buffer";
            } else if (input < 0) {
                throw "Input value must be positive";
            }
            return fromInteger(input);
        } else {
            throw "Unsupported type";
        }
    };

    var convertToUInt32 = function (i) {
        var tmp = new Uint8Array(new ArrayBuffer(4));
        tmp[0] = (i & 0xFF000000) >> 24;
        tmp[1] = (i & 0x00FF0000) >> 16;
        tmp[2] = (i & 0x0000FF00) >> 8;
        tmp[3] = (i & 0x000000FF);
        return tmp;
    };

    /* Digest implementation */
    var dg = function (Constructor) {
        var update = function (input) {
            var len = input.length;
            var offset = 0;
            while (len > 0) {
                var copyLen = this.blockLen - this.inLen;
                if (copyLen > len) {
                    copyLen = len;
                }
                var tmpInput = input.subarray(offset, offset + copyLen);
                this.inbuf.set(tmpInput, this.inLen);
                offset += copyLen;
                len -= copyLen;
                this.inLen += copyLen;
                if (this.inLen === this.blockLen) {
		    //var t0 = performance.now();
                    this.processBlock(this.inbuf);
		    //var t1 = performance.now();
		    //console.log(t1 - t0);
                    this.inLen = 0;
                }
            }
        };

        var finalize = function () {
            var padding = this.doPadding();
            this.update(padding);
            var result = this.getDigest();
            this.reset();
            return result;
        };

        var engine = (function () {
            if (!Constructor) {
                throw "Unsupported algorithm: " + Constructor.toString();
            }
            Constructor.prototype.update = update;
            Constructor.prototype.finalize = finalize;
            var engine = new Constructor();
            engine.inbuf = new Uint8Array(new ArrayBuffer(engine.blockLen));
            engine.reset();
            return engine;
        }());

        return {
            update: function (input) {
                engine.update(convertToUint8Array(input));
            },

            finalize: function () {
                return engine.finalize();
            },

            digest: function (input) {
                engine.update(convertToUint8Array(input));
                return engine.finalize();
            },

            reset: function () {
                engine.reset();
            },

            digestLength: function () {
                return engine.digestLen;
            }
        };
    };

    /* HMAC implementation */
    var hmac = function (digest) {
        var initialized = false;
        var key, ipad, opad;
        var init = function () {
            var i, kbuf;
            if (initialized) {
                return;
            }
            if (key === undefined) {
                throw "MAC key is not defined";
            }
            if (key.byteLength > 64) { /* B = 64 */
                kbuf = new Uint8Array(digest.digest(key));
            } else {
                kbuf = new Uint8Array(key);
            }
            ipad = new Uint8Array(new ArrayBuffer(64));
            for (i = 0; i < kbuf.length; i++) {
                ipad[i] = 0x36 ^ kbuf[i];
            }
            for (i = kbuf.length; i < 64; i++) {
                ipad[i] = 0x36;
            }
            opad = new Uint8Array(new ArrayBuffer(64));
            for (i = 0; i < kbuf.length; i++) {
                opad[i] = 0x5c ^ kbuf[i];
            }
            for (i = kbuf.length; i < 64; i++) {
                opad[i] = 0x5c;
            }
            initialized = true;
            digest.update(ipad.buffer);
        };

        var resetMac = function () {
            initialized = false;
            key = undefined;
            ipad = undefined;
            opad = undefined;
            digest.reset();
        };

        var finalizeMac = function () {
            var result = digest.finalize();
            digest.reset();
            digest.update(opad.buffer);
            digest.update(result);
            result = digest.finalize();
            resetMac();
            return result;
        };

        var setKeyMac = function (k) {
            key = k;
        };

        return {
            setKey: function (key) {
                setKeyMac(convertToUint8Array(key));
                init();
            },

            update: function (input) {
                digest.update(input);
            },

            finalize: function () {
                return finalizeMac();
            },

            mac: function (input) {
                this.update(input);
                return this.finalize();
            },

            reset: function () {
                resetMac();
            },

            hmacLength: function () {
                return digest.digestLength();
            }
        };
    };

    /* PBKDF1 Implementation */
    var pbkdf1 = function (digest, iterationCount) {

        var derive = function (password, salt, len) {
            var key, i, tmpBuf;
            if (len > digest.digestLength()) {
                throw "Key length larger than digest length";
            }
            digest.reset();
            digest.update(password);
            digest.update(salt);
            tmpBuf = digest.finalize();
            for (i = 1; i < iterationCount; i++) {
                tmpBuf = digest.digest(tmpBuf);
            }
            return tmpBuf.slice(0, len);
        };

        return {
            deriveKey: function (password, salt, len) {
                return derive(convertToUint8Array(password), convertToUint8Array(salt), len);
            }
        };
    };

    /* PBKDF2 Implementation */
    var pbkdf2 = function (prf, iterationCount) {

        var xor = function (l, r) {
            var i;
            for (i = 0; i < l.length; i++) {
                l[i] = l[i] ^ r[i];
            }
            return l;
        };

        var _F = function (password, salt, iterationCount, i) {
            var k;
            var Ti = new Uint8Array(new ArrayBuffer(prf.hmacLength()));
            var U = new Uint8Array(new ArrayBuffer(salt.length + 4));
            U.set(salt, 0);
            U.set(convertToUInt32(i), salt.length);
            for (k = 1; k <= iterationCount; k++) {
                prf.setKey(password);
                prf.update(U);
                U = new Uint8Array(prf.finalize());
                Ti = xor(Ti, U);
            }
            return Ti;
        };

        var derive = function (password, salt, len) {
            var i, l, tmpBuf;
            if (len > prf.hmacLength() * 0xFFFFFFFF) {
                throw "Derived key length too long";
            }
            l = Math.ceil(len / prf.hmacLength());
            tmpBuf = new Uint8Array(new ArrayBuffer(len * prf.hmacLength()));
            for (i = 1; i <= l; i++) {
                tmpBuf.set(_F(password, salt, iterationCount, i), prf.hmacLength() * (i - 1));
            }
            return tmpBuf.buffer.slice(0, len);
        };

        return {
            deriveKey: function (password, salt, len) {
                return derive(convertToUint8Array(password), convertToUint8Array(salt), len);
            }
        };
    };

    var Digest = {
        SHA1: function () {
            return dg(sha1Engine);
        },

        MD5: function () {
            return dg(md5Engine);
        },

        SHA256: function () {
            return dg(sha256Engine);
        },

        HMAC_SHA1: function () {
            return hmac(dg(sha1Engine));
        },

        HMAC_MD5: function () {
            return hmac(dg(md5Engine));
        },

        HMAC_SHA256: function () {
            return hmac(dg(sha256Engine));
        },

        PBKDF1_SHA1: function (iterationCount) {
            return pbkdf1(dg(sha1Engine), iterationCount);
        },

        PBKDF1_MD5: function (iterationCount) {
            return pbkdf1(dg(md5Engine), iterationCount);
        },

        PBKDF2_HMAC_SHA1: function (iterationCount) {
            return pbkdf2(hmac(dg(sha1Engine)), iterationCount);
        },

        PBKDF2_HMAC_SHA256: function (iterationCount) {
            return pbkdf2(hmac(dg(sha256Engine)), iterationCount);
        }
    };

    if ("undefined" !== typeof exports) { /* Node Support */
        if (("undefined" !== typeof module) && module.exports) {
          module.exports = exports = Digest;
        } else {
            exports = Digest;
        }
    } else { /* Browsers and Web Workers*/
        global.Digest = Digest;
    }
}(this));
