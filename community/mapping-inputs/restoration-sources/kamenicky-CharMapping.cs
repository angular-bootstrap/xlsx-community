using System;
using System.Text;

namespace Keybcs2
{
    /// <summary>
    /// Implementation of KEYBCS2 (Kamenicky) encoding.
    /// This implementation strictly follows the mnemonic definition provided in 
    /// Source docu: http://www.cestina.cz/kodovani/dvojznaky.html#KEYBCS2
    /// </summary>
    internal static class CharMapping
    {
        public static readonly char[] ToChar = new char[256]
        {
            // 0-127: Standard ASCII
            '\0','\x01','\x02','\x03','\x04','\x05','\x06','\a','\b','\t','\n','\v','\f','\r','\x0e','\x0f',
            '\x10','\x11','\x12','\x13','\x14','\x15','\x16','\x17','\x18','\x19','\x1a','\x1b','\x1c','\x1d','\x1e','\x1f',
            ' ','!','"','#','$','%','&','\'','(',')','*','+',',','-','.','/',
            '0','1','2','3','4','5','6','7','8','9',':',';','<','=','>','?',
            '@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
            'P','Q','R','S','T','U','V','W','X','Y','Z','[','\\',']','^','_',
            '`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o',
            'p','q','r','s','t','u','v','w','x','y','z','{','|','}','~','\x7f',

            // 128-143: Czech/Slovak
            '\u010C','\u00FC','\u00E9','\u010F','\u00E4','\u010E','\u0164','\u010D',
            '\u011B','\u011A','\u0139','\u00CD','\u013E','\u013A','\u00C4','\u00C1',

            // 144-159: Czech/Slovak
            '\u00C9','\u017E','\u017D','\u00F4','\u00F6','\u00D3','\u016F','\u00DA',
            '\u00FD','\u00D6','\u00DC','\u0160','\u013D','\u00DD','\u0158','\u0165',

            // 160-175: Czech/Slovak
            '\u00E1','\u00ED','\u00F3','\u00FA','\u0148','\u0147','\u016E','\u00D4',
            '\u0161','\u0159','\u0155','\u0154','\u00BC','\u00A7','\u00AB','\u00BB',

            // 176-191: Box-drawing (CP437)
            '\u2591','\u2592','\u2593','\u2502','\u2524','\u2561','\u2562','\u2556',
            '\u2555','\u2563','\u2551','\u2557','\u255D','\u255C','\u255B','\u2510',

            // 192-207: Box-drawing (CP437)
            '\u2514','\u2534','\u252C','\u251C','\u2500','\u253C','\u255E','\u255F',
            '\u255A','\u2554','\u2569','\u2566','\u2560','\u2550','\u256C','\u2567',

            // 208-223: Box-drawing (CP437)
            '\u2568','\u2564','\u2565','\u2559','\u2558','\u2552','\u2553','\u256B',
            '\u256A','\u2518','\u250C','\u2588','\u2584','\u258B','\u2590','\u2580',

            // 224-239: Mathematical / Greek symbols (CP437)
            '\u03B1','\u00DF','\u0393','\u03C0','\u03A3','\u03C3','\u00B5','\u03C4',
            '\u03A6','\u0398','\u03A9','\u03B4','\u221E','\u03C6','\u03B5','\u2229',

            // 240-255: Miscellaneous (CP437)
            '\u2261','\u00B1','\u2265','\u2264','\u2320','\u2321','\u00F7','\u2248',
            '\u00B0','\u2219','\u00B7','\u221A','\u207F','\u00B2','\u25A0','\u00A0'
        };

        public static readonly byte[] ToByte = new byte[65536];

        static CharMapping()
        {
            for (int i = 0; i < ToByte.Length; i++)
                ToByte[i] = 63; // ASCII '?'

            for (int i = 0; i < 256; i++)
                ToByte[ToChar[i]] = (byte)i;
        }
    }
}