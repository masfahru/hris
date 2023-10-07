/*--------------------------------------------------------------------------

@sinclair/typebox/format

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

const TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;

/**
 * `[ajv-formats]` ISO8601 Time component
 * @example `20:20:39+00:00`
 */

export function IsTime(value: string, strictTimeZone = false): boolean {
	const matches = TIME.exec(value);
	if (!matches) {
		return false;
	}

	const [_, hr, min, sec, tz, tzSign, tzH, tzM] = matches.map((match) =>
		match ? +match : 0,
	);

	if (tzH > 23 || tzM > 59 || (strictTimeZone && !tz)) {
		return false;
	}

	if (hr <= 23 && min <= 59 && sec < 60) {
		return true;
	}

	const utcMin = min - tzM * tzSign;
	const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);

	return (
		(utcHr === 23 || utcHr === -1) &&
		(utcMin === 59 || utcMin === -1) &&
		sec < 61
	);
}
