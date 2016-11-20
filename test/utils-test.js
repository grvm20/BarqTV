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

  describe ('#isUuidString()', () => {
    it('should return true when the string is an UUID (RFC4122)', () => {
      expect(Utils.isUuidString(
        "48b579e3-f101-4b5e-806a-48e9b7caea6e")).to.be.true;
      expect(Utils.isUuidString(
        "48B579E3-F101-4B5E-806A-48E9B7CAEA6E")).to.be.true;
      expect(Utils.isUuidString(
        "8b6d7391-abc6-4641-8692-a5d74658c2f9")).to.be.true;
      expect(Utils.isUuidString(
        "9672bfcd-8adb-42d9-b7d4-3e1d6ccd8796")).to.be.true;
      expect(Utils.isUuidString(
        "454F24AC-F7C6-499D-96AC-A2F7A4862A33")).to.be.true;
      expect(Utils.isUuidString(
        "FF288D55-5F01-48BF-A18C-6154B87AB68C")).to.be.true;
    });

    it('should return false otherwise', () => {
      expect(Utils.isUuidString(
        "email@domain.com")).to.be.false;
      expect(Utils.isUuidString(
        "this is simply a normal string")).to.be.false;
      expect(Utils.isUuidString(
        "8b6d7391-abc6-4641-8692-a5d74658c2f")).to.be.false;
      expect(Utils.isUuidString(
        "9672bfcd-8adb-42d9-b7d4-3e1d6ccg8796")).to.be.false;
      expect(Utils.isUuidString(
        "")).to.be.false;
      expect(Utils.isUuidString(
        "¢¢®œå∫ƒß#¢å∑")).to.be.false;
    });
  });

  describe ('#isEmailString()', () => {
    it('should return true when the string is an email', () => {
      expect(Utils.isEmailString(
        "test@domain.com")).to.be.true;
      expect(Utils.isEmailString(
        "this.is.still.an.email@mydomain.es")).to.be.true;
      expect(Utils.isEmailString(
        "plus+symbols+count@yeap.com")).to.be.true;
      expect(Utils.isEmailString(
        "domains-with-hypens@count.yes")).to.be.true;
      expect(Utils.isEmailString(
        "CASEdoesntMATTER@yahoo.es")).to.be.true;
      expect(Utils.isEmailString(
        "multiletter@domain.bigstuffhere")).to.be.true;
    });

    it('should return false otherwise', () => {
      expect(Utils.isEmailString(
        "email@@domain.com")).to.be.false;
      expect(Utils.isEmailString(
        "this is simply a normal string")).to.be.false;
      expect(Utils.isEmailString(
        "email(e@domain.com")).to.be.false;
      expect(Utils.isEmailString(
        "09987987@8129391.12312")).to.be.false;
      expect(Utils.isEmailString(
        "")).to.be.false;
      expect(Utils.isEmailString(
        "¢¢®œå∫ƒß#¢å∑")).to.be.false;
    });
  });
});
