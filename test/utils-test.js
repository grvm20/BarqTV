const expect = require('chai').expect;
const Utils = require("../app/utilities/utils");

describe('Utils', () => {
  describe('#isEmpty()', () => {
    it('should return true when the value is null, undefined, [], "" or "\s*"', () => {
      expect(Utils.isEmpty(null)).to.be.true;
      expect(Utils.isEmpty(undefined)).to.be.true;
      expect(Utils.isEmpty([])).to.be.true;
      expect(Utils.isEmpty("")).to.be.true;
      expect(Utils.isEmpty(" ")).to.be.true;
      expect(Utils.isEmpty("     ")).to.be.true;
      expect(Utils.isEmpty("    ")).to.be.true;
    });

    it('should return false otherwise', () => {
      expect(Utils.isEmpty(Utils)).to.be.false;
      expect(Utils.isEmpty([1])).to.be.false;
      expect(Utils.isEmpty(" a ")).to.be.false;
      expect(Utils.isEmpty(5.7)).to.be.false;
      expect(Utils.isEmpty(false)).to.be.false;
    });
  });

  describe ('#isAlphabeticString()', () => {
    it('should return true with valid alphabetic strings', () => {
      expect(Utils.isAlphabeticString("hola")).to.be.true;
      expect(Utils.isAlphabeticString("Main St.")).to.be.true;
      expect(Utils.isAlphabeticString("José Rodrigañez")).to.be.true;
      expect(Utils.isAlphabeticString("  hey wassap  ")).to.be.true;
      expect(Utils.isAlphabeticString("This is, a string, yeah")).to.be.true;
    });
    it('should return false when symbols are present', () => {
      expect(Utils.isAlphabeticString("/route")).to.be.false;
      expect(Utils.isAlphabeticString("(halo)")).to.be.false;
      expect(Utils.isAlphabeticString("_underscore_")).to.be.false;
      expect(Utils.isAlphabeticString("weird*stuff{}")).to.be.false;
      expect(Utils.isAlphabeticString("AM I FALSE?")).to.be.false;
      expect(Utils.isAlphabeticString("HEY! I dont wanna be false")).to.be.false;
      expect(Utils.isAlphabeticString("ok, whatever you want :(")).to.be.false;
      expect(Utils.isAlphabeticString("#hateprogrammers...")).to.be.false;
    });
    it('should return false when the string is empty', () => {
      expect(Utils.isAlphabeticString("")).to.be.false;
    });
  });
});
