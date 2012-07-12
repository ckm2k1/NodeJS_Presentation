/*global Zepto:false */

(function paintAllNodejs() {
    Zepto('p, h3, h2, h1').each(function(index, elem) {
        var zp = Zepto(elem);
        zp.html(zp.html().replace(/\.js/g, ".<span class='nodeGreen'>js</span>"));
        zp.html(zp.html().replace(/[nN]ode(?=[\?|\.|,\ ])/g, " <span class='nodeGreen'>Node</span>"));
        zp.html(zp.html().replace(/[J|j]ava(S|s)cript/g, "<span class='nodeGreen'>Javascript</span>"));
    });

})();
// paintAllNodejs();
