import { FakerError } from '../../errors/faker-error';
import { ModuleBase } from '../../internal/module-base';

// Source for official prefixes: https://www.isbn-international.org/range_file_generation
const ISBN_LENGTH_RULES: Record<
  string,
  Array<[rangeMaximum: number, length: number]>
> = {
  '0': [
    [1_999_999, 2],
    [2_279_999, 3],
    [2_289_999, 4],
    [3_689_999, 3],
    [3_699_999, 4],
    [6_389_999, 3],
    [6_397_999, 4],
    [6_399_999, 7],
    [6_449_999, 3],
    [6_459_999, 7],
    [6_479_999, 3],
    [6_489_999, 7],
    [6_549_999, 3],
    [6_559_999, 4],
    [6_999_999, 3],
    [8_499_999, 4],
    [8_999_999, 5],
    [9_499_999, 6],
    [9_999_999, 7],
  ],
  '1': [
    [99_999, 3],
    [299_999, 2],
    [349_999, 3],
    [399_999, 4],
    [499_999, 3],
    [699_999, 2],
    [999_999, 4],
    [3_979_999, 3],
    [5_499_999, 4],
    [6_499_999, 5],
    [6_799_999, 4],
    [6_859_999, 5],
    [7_139_999, 4],
    [7_169_999, 3],
    [7_319_999, 4],
    [7_399_999, 7],
    [7_749_999, 5],
    [7_753_999, 7],
    [7_763_999, 5],
    [7_764_999, 7],
    [7_769_999, 5],
    [7_782_999, 7],
    [7_899_999, 5],
    [7_999_999, 4],
    [8_004_999, 5],
    [8_049_999, 5],
    [8_379_999, 5],
    [8_384_999, 7],
    [8_671_999, 5],
    [8_675_999, 4],
    [8_697_999, 5],
    [9_159_999, 6],
    [9_165_059, 7],
    [9_168_699, 6],
    [9_169_079, 7],
    [9_195_999, 6],
    [9_196_549, 7],
    [9_729_999, 6],
    [9_877_999, 4],
    [9_911_499, 6],
    [9_911_999, 7],
    [9_989_899, 6],
    [9_999_999, 7],
  ],
};

/**
 * Module to generate commerce and product related entries.
 *
 * ### Overview
 *
 * For a long product name like `'Incredible Soft Gloves'`, use [`productName()`](https://fakerjs.dev/api/commerce.html#productname). The product names are generated from a list of adjectives, materials, and products, which can each be accessed separately using [`productAdjective()`](https://fakerjs.dev/api/commerce.html#productadjective), [`productMaterial()`](https://fakerjs.dev/api/commerce.html#productmaterial), and [`product()`](https://fakerjs.dev/api/commerce.html#product). You can also create a description using [`productDescription()`](https://fakerjs.dev/api/commerce.html#productdescription).
 *
 * For a department in a shop or product category, use [`department()`](https://fakerjs.dev/api/commerce.html#department).
 *
 * You can also create a price using [`price()`](https://fakerjs.dev/api/commerce.html#price).
 */
export class CommerceModule extends ModuleBase {
  /**
   * Returns a department inside a shop.
   *
   * @example
   * faker.commerce.department() // 'Garden'
   *
   * @since 3.0.0
   */
  department(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.commerce.department
    );
  }

  /**
   * Generates a random descriptive product name.
   *
   * @example
   * faker.commerce.productName() // 'Incredible Soft Gloves'
   *
   * @since 3.0.0
   */
  productName(): string {
    return `${this.productAdjective()} ${this.productMaterial()} ${this.product()}`;
  }

  /**
   * Generates a price between min and max (inclusive).
   *
   * To better represent real-world prices, when `options.dec` is greater than `0`, the final decimal digit in the returned string will be generated as follows:
   *
   * - 50% of the time: `9`
   * - 30% of the time: `5`
   * - 10% of the time: `0`
   * - 10% of the time: a random digit from `0` to `9`
   *
   * @param options An options object.
   * @param options.min The minimum price. Defaults to `1`.
   * @param options.max The maximum price. Defaults to `1000`.
   * @param options.dec The number of decimal places. Defaults to `2`.
   * @param options.symbol The currency value to use. Defaults to `''`.
   *
   * @example
   * faker.commerce.price() // 828.07
   * faker.commerce.price({ min: 100 }) // 904.19
   * faker.commerce.price({ min: 100, max: 200 }) // 154.55
   * faker.commerce.price({ min: 100, max: 200, dec: 0 }) // 133
   * faker.commerce.price({ min: 100, max: 200, dec: 0, symbol: '$' }) // $114
   *
   * @since 3.0.0
   */
  price(
    options: {
      /**
       * The minimum price.
       *
       * @default 1
       */
      min?: number;
      /**
       * The maximum price.
       *
       * @default 1000
       */
      max?: number;
      /**
       * The number of decimal places.
       *
       * @default 2
       */
      dec?: number;
      /**
       * The currency value to use.
       *
       * @default ''
       */
      symbol?: string;
    } = {}
  ): string {
    const { dec = 2, max = 1000, min = 1, symbol = '' } = options;

    if (min < 0 || max < 0) {
      return `${symbol}0`;
    }

    if (min === max) {
      return `${symbol}${min.toFixed(dec)}`;
    }

    const generated = this.faker.number.float({
      min,
      max,
      fractionDigits: dec,
    });

    if (dec === 0) {
      return `${symbol}${generated.toFixed(dec)}`;
    }

    const oldLastDigit = (generated * 10 ** dec) % 10;
    const newLastDigit = this.faker.helpers.weightedArrayElement([
      { weight: 5, value: 9 },
      { weight: 3, value: 5 },
      { weight: 1, value: 0 },
      {
        weight: 1,
        value: this.faker.number.int({ min: 0, max: 9 }),
      },
    ]);

    const fraction = (1 / 10) ** dec;
    const oldLastDigitValue = oldLastDigit * fraction;
    const newLastDigitValue = newLastDigit * fraction;
    const combined = generated - oldLastDigitValue + newLastDigitValue;

    if (min <= combined && combined <= max) {
      return `${symbol}${combined.toFixed(dec)}`;
    }

    return `${symbol}${generated.toFixed(dec)}`;
  }

  /**
   * Returns an adjective describing a product.
   *
   * @example
   * faker.commerce.productAdjective() // 'Handcrafted'
   *
   * @since 3.0.0
   */
  productAdjective(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.commerce.product_name.adjective
    );
  }

  /**
   * Returns a material of a product.
   *
   * @example
   * faker.commerce.productMaterial() // 'Rubber'
   *
   * @since 3.0.0
   */
  productMaterial(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.commerce.product_name.material
    );
  }

  /**
   * Returns a short product name.
   *
   * @example
   * faker.commerce.product() // 'Computer'
   *
   * @since 3.0.0
   */
  product(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.commerce.product_name.product
    );
  }

  /**
   * Returns a product description.
   *
   * @example
   * faker.commerce.productDescription() // 'Andy shoes are designed to keeping...'
   *
   * @since 5.0.0
   */
  productDescription(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.commerce.product_description
    );
  }

  /**
   * Returns a random [ISBN](https://en.wikipedia.org/wiki/ISBN) identifier.
   *
   * @param options The variant to return or an options object.
   * @param options.variant The variant to return. Can be either `10` (10-digit format)
   * or `13` (13-digit format). Defaults to `13`.
   * @param options.separator The separator to use in the format. Defaults to `'-'`.
   *
   * @example
   * faker.commerce.isbn() // '978-0-692-82459-7'
   * faker.commerce.isbn(10) // '1-155-36404-X'
   * faker.commerce.isbn(13) // '978-1-60808-867-6'
   * faker.commerce.isbn({ separator: ' ' }) // '978 0 452 81498 1'
   * faker.commerce.isbn({ variant: 10, separator: ' ' }) // '0 940319 49 7'
   * faker.commerce.isbn({ variant: 13, separator: ' ' }) // '978 1 6618 9122 0'
   *
   * @since 8.1.0
   */
  isbn(
    options:
      | 10
      | 13
      | {
          /**
           * The variant of the identifier to return.
           * Can be either `10` (10-digit format)
           * or `13` (13-digit format).
           *
           * @default 13
           */
          variant?: 10 | 13;

          /**
           * The separator to use in the format.
           *
           * @default '-'
           */
          separator?: string;
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { variant: options };
    }

    const { variant = 13, separator = '-' } = options;

    const prefix = '978';
    const [group, groupRules] =
      this.faker.helpers.objectEntry(ISBN_LENGTH_RULES);
    const element = this.faker.string.numeric(8);
    const elementValue = Number.parseInt(element.slice(0, -1));

    const registrantLength = groupRules.find(
      ([rangeMaximum]) => elementValue <= rangeMaximum
    )?.[1];

    if (!registrantLength) {
      // This can only happen if the ISBN_LENGTH_RULES are corrupted
      throw new FakerError(
        `Unable to find a registrant length for the group ${group}`
      );
    }

    const registrant = element.slice(0, registrantLength);
    const publication = element.slice(registrantLength);

    const data = [prefix, group, registrant, publication];
    if (variant === 10) {
      data.shift();
    }

    const isbn = data.join('');

    let checksum = 0;
    for (let i = 0; i < variant - 1; i++) {
      const weight = variant === 10 ? i + 1 : i % 2 ? 3 : 1;
      checksum += weight * Number.parseInt(isbn[i]);
    }

    checksum = variant === 10 ? checksum % 11 : (10 - (checksum % 10)) % 10;

    data.push(checksum === 10 ? 'X' : checksum.toString());

    return data.join(separator);
  }
}
