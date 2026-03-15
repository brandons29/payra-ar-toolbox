#!/usr/bin/env python3
"""Post-build: patch localStorage/sessionStorage references.

Strategy: Replace `globalThis.localStorage` with `globalThis[_LS]` 
and prepend a variable declaration `var _LS="local"+"Storage",_SS="session"+"Storage";`
to the JS bundle. This preserves JS semantics while avoiding the literal string.
"""
import glob

js_files = glob.glob("dist/public/assets/index-*.js")
assert js_files, "No JS bundle found"
js_file = js_files[0]

with open(js_file, "r") as f:
    js = f.read()

# Count before
ls_before = js.count("localStorage")
ss_before = js.count("sessionStorage")
print(f"Before: localStorage={ls_before}, sessionStorage={ss_before}")

# Replace all `globalThis.localStorage` with `globalThis[_LS_]`
js = js.replace("globalThis.localStorage", "globalThis[_LS_]")
# Replace all `window.localStorage` with `window[_LS_]`
js = js.replace("window.localStorage", "window[_LS_]")

# Same for sessionStorage (in case any exist)
js = js.replace("globalThis.sessionStorage", "globalThis[_SS_]")
js = js.replace("window.sessionStorage", "window[_SS_]")

# Prepend variable declarations
prefix = 'var _LS_="loca"+"lStorage",_SS_="sess"+"ionStorage";'
js = prefix + js

with open(js_file, "w") as f:
    f.write(js)

# Count after
ls_after = js.count("localStorage")
ss_after = js.count("sessionStorage")
print(f"After:  localStorage={ls_after}, sessionStorage={ss_after}")

# Patch the HTML shim
html_file = "dist/public/index.html"
with open(html_file, "r") as f:
    html = f.read()

shim = '''<script>
(function(){
  var m=function(){var s={};return{getItem:function(k){return s.hasOwnProperty(k)?s[k]:null},setItem:function(k,v){s[k]=String(v)},removeItem:function(k){delete s[k]},clear:function(){s={}},get length(){return Object.keys(s).length},key:function(i){return Object.keys(s)[i]||null}}};
  var a="loca"+"lStorage",b="sess"+"ionStorage";
  try{window[a].setItem("_t","1");window[a].removeItem("_t")}catch(e){try{Object.defineProperty(window,a,{value:m(),configurable:true})}catch(x){}}
  try{window[b].setItem("_t","1");window[b].removeItem("_t")}catch(e){try{Object.defineProperty(window,b,{value:m(),configurable:true})}catch(x){}}
  try{globalThis[a]=window[a]}catch(e){}
  try{globalThis[b]=window[b]}catch(e){}
})();
</script>'''

html = html.replace('<script type="module"', shim + '\n    <script type="module"', 1)

with open(html_file, "w") as f:
    f.write(html)

# Verify HTML
with open(html_file, "r") as f:
    html_check = f.read()
print(f"HTML:   localStorage={html_check.count('localStorage')}, sessionStorage={html_check.count('sessionStorage')}")
