// jsdom doesn't implement Element.prototype.scrollIntoView; stub it so
// components that scroll the highlighted item into view don't blow up.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
