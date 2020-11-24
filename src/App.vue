<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
html,
body,
div,
span,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
abbr,
address,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
samp,
small,
strong,
sub,
sup,
var,
b,
i,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  /*border:0;
	*/
  /*outline:0;
	*/
  /*font-size:100%;
	vertical-align:baseline;
	background:transparent;
	*/
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  cursor: url('assets/mouse.png'),auto;
  overflow: hidden;
}

#app {
  /* background-image: url("assets/bg.gif"); */
  background-color: black;
  background-size: 850px;
  background-repeat: no-repeat;
  background-position: 15% center;
}
h1,
h2,
h3,
h4,
h5,
h6,
em,
i {
  font-weight: 100;
  font-style: normal;
}
ul,
ol,
li {
  list-style-type: none;
}
a {
  color: #666;
  text-decoration: none;
  outline: 0;
}
a:hover {
  text-decoration: none;
}
</style>
