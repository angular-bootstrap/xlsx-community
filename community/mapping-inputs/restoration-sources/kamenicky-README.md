# Kamenicky Encoding

**Kamenicky Encoding** is a .NET library providing an implementation of the **Keybcs2** (Kamenický) Czech code page. It enables conversion between Czech characters and bytes in legacy computer systems and ensures compatibility with older text files and applications.

The library is **fast**, as it uses precomputed character ↔ byte mappings instead of complex algorithms or runtime lookups.

## History

Keybcs2 (Kamenický) originated in the 1980s–1990s for Czech and Slovak environments, where standard ASCII did not support diacritics. It was commonly used in older text editors, accounting software, and database applications.

**Kamenicky Encoding** provides a modern .NET implementation of this encoding, including full support for Czech characters and special symbols.

> The character mapping was **inspired by** the Free Pascal file [cp895.txt](https://gemfury.com/bee/deb%3Afpc-src/-/content/usr/share/fpcsrc/3.0.0/rtl/ucmaps/cp895.txt) (FPC).

## Usage Without Provider Registration

The simplest way to use the library is directly via a `Keybcs2Encoding` instance, **without registering the provider**:

```csharp
var encoding = new Keybcs2Encoding();

string original = "Příliš žluťoučký kůň";
byte[] data = encoding.GetBytes(original);
string restored = encoding.GetString(data);

Console.WriteLine(restored); // Příliš žluťoučký kůň
```

This approach is ideal for isolated use, e.g., reading or writing individual files.

## Optional Provider Registration

To use Keybcs2 via the standard `Encoding.GetEncoding`, you can register the provider:

```csharp
Keybcs2EncodingProvider.Register();
var encoding = Encoding.GetEncoding("keybcs2"); // or "kamenicky", "kamenicky895"
```

After registration, you can use any of these names:

* `"keybcs2"` – primary name
* `"kamenicky"` – alias
* `"kamenicky895"` – alias

```csharp
string original = "Příliš žluťoučký kůň";
byte[] data = encoding.GetBytes(original);
string restored = encoding.GetString(data);

Console.WriteLine(restored); // Příliš žluťoučký kůň
```

### Note About the CP895 Alias

This code page is sometimes referred to as **CP895** or **code page 895** in DOS-era applications.
However, this **is not an officially registered code page number** — for example, **IBM uses CP895 for a completely different (Japanese) set**, and IANA does not recognize CP895 for Kamenický encoding.
Using “CP895” may therefore be **ambiguous or conflicting** in some environments. ([source](https://en.wikipedia.org/wiki/Kamenick%C3%BD_encoding?utm_source=chatgpt.com))

## Features

* Conversion of characters to Keybcs2 bytes and back
* Optional provider registration for global use via `Encoding.GetEncoding`
* Compatible with .NET Standard and .NET Core
* Full support for Czech characters and certain special symbols
* Unsupported characters are replaced with `?`
* **Very fast** due to precomputed character ↔ byte mapping

## Implementation

* **Keybcs2EncodingProvider** – provides a `Keybcs2Encoding` instance through the standard .NET `EncodingProvider` mechanism
* **Keybcs2Encoding** – implements all necessary `Encoding` methods for Keybcs2
* **CharMapping** – internal static class mapping each byte to the corresponding Unicode character and vice versa

Mapping includes:

* ASCII characters (0–127)
* Czech/Slovak characters (128–175)
* Box-drawing characters (176–223)
* Greek and mathematical symbols (224–239)
* Miscellaneous symbols (240–255)

## License

This project is licensed under the [MIT License](LICENSE).
