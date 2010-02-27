Ajax.PeriodicalUpdater=Class.create();
Class.inherit(Ajax.PeriodicalUpdater,Ajax.Base,{initialize:function(a){this.setOptions(a);this._options.onComplete=this.requestComplete.bind(this);this._options.onException=this.handleException.bind(this);this._options.onTimeout=this.handleTimeout.bind(this);this._options.timeout=5E3;this.frequency=this._options.frequency||2;this.updater={};this.update()},handleException:function(){this._options.handleError&&this._options.handleError("offline, reconnecting");this.stopUpdate();this.timer=setTimeout(this.update.bind(this),
1E3)},handleTimeout:function(){this._options.handleError&&this._options.handleError("timeout, reconnecting");this.stopUpdate();this.timer=setTimeout(this.update.bind(this),1E3)},stopUpdate:function(){if(this.updater._options)this.updater._options.onComplete=undefined;clearTimeout(this.timer)},update:function(){if(this._options.updateParams)this._options.parameters=this._options.updateParams();this.updater=new Ajax.Request(this._options.url,this._options)},requestComplete:function(a){try{var b=Ajax.getXml(a);
if(b)(this._options.updateContent||Ajax.emptyFunction)(b);else this._options.handleError&&this._options.handleError("reconnecting")}catch(c){}this.timer=setTimeout(this.update.bind(this),this.frequency*1E3)}});
var HtmlGenerationUtils={popupLink:function(a,b,c,d,e,l,j){return'<a href="'+a+'"'+(j!=null?' class="'+j+'"':"")+' target="_blank" title="'+b+'" onclick="this.newWindow = window.open(\''+a+"', '"+c+"', 'toolbar=0,scrollbars=0,location=0,status=1,menubar=0,width="+e+",height="+l+",resizable=1');this.newWindow.focus();this.newWindow.opener=window;return false;\">"+d+"</a>"},generateOneRowTable:function(a){return'<table class="inner"><tr>'+a+"</tr></table>"},viewOpenCell:function(a,b,c,d,e,l,j,m){l=
2;b=b+"?thread="+c;var g="<td>";g+=e||d?HtmlGenerationUtils.popupLink(m||!d?b:b+"&viewonly=true",localized[e?0:1],"ImCenter"+c,a,640,480,null):'<a href="#">'+a+"</a>";g+="</td>";if(e){g+='<td class="icon">';g+=HtmlGenerationUtils.popupLink(b,localized[0],"ImCenter"+c,'<img src="'+webimRoot+'/images/tbliclspeak.gif" width="15" height="15" border="0" alt="'+localized[0]+'">',640,480,null);g+="</td>";l++}if(d){g+='<td class="icon">';g+=HtmlGenerationUtils.popupLink(b+"&viewonly=true",localized[1],"ImCenter"+
c,'<img src="'+webimRoot+'/images/tbliclread.gif" width="15" height="15" border="0" alt="'+localized[1]+'">',640,480,null);g+="</td>";l++}if(j!=""){g+='</tr><tr><td class="firstmessage" colspan="'+l+'"><a href="javascript:void(0)" title="'+j+'" onclick="alert(this.title);return false;">';g+=j.length>30?j.substring(0,30)+"...":j;g+="</a></td>"}return HtmlGenerationUtils.generateOneRowTable(g)},banCell:function(a,b){return'<td class="icon">'+HtmlGenerationUtils.popupLink(webimRoot+"/operator/ban.php?"+
(b?"id="+b:"thread="+a),localized[2],"ban"+a,'<img src="'+webimRoot+'/images/ban.gif" width="15" height="15" border="0" alt="'+localized[2]+'">',720,480,null)+"</td>"}};Ajax.ThreadListUpdater=Class.create();
Class.inherit(Ajax.ThreadListUpdater,Ajax.Base,{initialize:function(a){this.setOptions(a);this._options.updateParams=this.updateParams.bind(this);this._options.handleError=this.handleError.bind(this);this._options.updateContent=this.updateContent.bind(this);this._options.lastrevision=0;this.threadTimers={};this.delta=0;this.t=this._options.table;this.periodicalUpdater=new Ajax.PeriodicalUpdater(this._options)},updateParams:function(){return"since="+this._options.lastrevision+"&status="+this._options.istatus},
setStatus:function(a){this._options.status.innerHTML=a},handleError:function(a){this.setStatus(a)},updateThread:function(a){function b(s,w,x,y){if(s=CommonUtils.getCell(x,w,s))s.innerHTML=y}for(var c,d,e,l=false,j=false,m=false,g=null,o=null,f=0;f<a.attributes.length;f++){var n=a.attributes[f];if(n.nodeName=="id")c=n.nodeValue;else if(n.nodeName=="stateid")d=n.nodeValue;else if(n.nodeName=="state")e=n.nodeValue;else if(n.nodeName=="canopen")j=true;else if(n.nodeName=="canview")l=true;else if(n.nodeName==
"canban")m=true;else if(n.nodeName=="ban")g=n.nodeValue;else if(n.nodeName=="banid")o=n.nodeValue}f=CommonUtils.getRow("thr"+c,this.t);if(d=="closed"){f&&this.t.deleteRow(f.rowIndex);this.threadTimers[c]=null}else{n=NodeUtils.getNodeValue(a,"name");var t=NodeUtils.getNodeValue(a,"addr"),q=NodeUtils.getNodeValue(a,"time"),u=NodeUtils.getNodeValue(a,"agent"),r=NodeUtils.getNodeValue(a,"modified"),v=NodeUtils.getNodeValue(a,"message"),p="<td>"+NodeUtils.getNodeValue(a,"useragent")+"</td>";if(g!=null)p=
"<td>"+NodeUtils.getNodeValue(a,"reason")+"</td>";if(m)p+=HtmlGenerationUtils.banCell(c,o);p=HtmlGenerationUtils.generateOneRowTable(p);a=CommonUtils.getRow("t"+d,this.t);m=CommonUtils.getRow("t"+d+"end",this.t);if(f!=null&&(f.rowIndex<=a.rowIndex||f.rowIndex>=m.rowIndex)){this.t.deleteRow(f.rowIndex);f=this.threadTimers[c]=null}if(f==null){f=this.t.insertRow(a.rowIndex+1);f.className=g=="blocked"&&d!="chat"?"ban":"in"+d;f.id="thr"+c;this.threadTimers[c]=new Array(q,r,d);CommonUtils.insertCell(f,
"name","visitor",null,null,HtmlGenerationUtils.viewOpenCell(n,this._options.agentservl,c,l,j,g,v,d!="chat"));CommonUtils.insertCell(f,"contid","visitor","center",null,t);CommonUtils.insertCell(f,"state","visitor","center",null,e);CommonUtils.insertCell(f,"op","visitor","center",null,u);CommonUtils.insertCell(f,"time","visitor","center",null,this.getTimeSince(q));CommonUtils.insertCell(f,"wait","visitor","center",null,d!="chat"?this.getTimeSince(r):"-");CommonUtils.insertCell(f,"etc","visitor","center",
null,p);if(d=="wait"||d=="prio")return true}else{this.threadTimers[c]=new Array(q,r,d);f.className=g=="blocked"&&d!="chat"?"ban":"in"+d;b(this.t,f,"name",HtmlGenerationUtils.viewOpenCell(n,this._options.agentservl,c,l,j,g,v,d!="chat"));b(this.t,f,"contid",t);b(this.t,f,"state",e);b(this.t,f,"op",u);b(this.t,f,"time",this.getTimeSince(q));b(this.t,f,"wait",d!="chat"?this.getTimeSince(r):"-");b(this.t,f,"etc",p)}return false}},updateQueueMessages:function(){function a(d,e){d=$(e);e=$(e+"end");if(d==
null||e==null)return false;return d.rowIndex+1<e.rowIndex}var b=$("statustd");if(b){var c=a(this.t,"twait")||a(this.t,"tprio")||a(this.t,"tchat");b.innerHTML=c?"":this._options.noclients;b.height=c?5:30}},getTimeSince:function(a){a=Math.floor(((new Date).getTime()-a-this.delta)/1E3);var b=Math.floor(a/60),c="";a%=60;if(a<10)a="0"+a;if(b>=60){c=Math.floor(b/60);b%=60;if(b<10)b="0"+b;c=c+":"}return c+b+":"+a},updateTimers:function(){for(var a in this.threadTimers)if(this.threadTimers[a]!=null){var b=
this.threadTimers[a],c=CommonUtils.getRow("thr"+a,this.t);if(c!=null){function d(e,l,j,m){if(e=CommonUtils.getCell(j,l,e))e.innerHTML=m}d(this.t,c,"time",this.getTimeSince(b[0]));d(this.t,c,"wait",b[2]!="chat"?this.getTimeSince(b[1]):"-")}}},updateContent:function(a){var b=false;if(a.tagName=="threads"){var c=NodeUtils.getAttrValue(a,"time"),d=NodeUtils.getAttrValue(a,"revision");if(c)this.delta=(new Date).getTime()-c;if(d)this._options.lastrevision=d;for(c=0;c<a.childNodes.length;c++){d=a.childNodes[c];
if(d.tagName=="thread")if(this.updateThread(d))b=true}this.updateQueueMessages();this.updateTimers();this.setStatus(this._options.istatus?"Away":"Up to date");if(b){playSound(webimRoot+"/sounds/new_user.wav");window.focus();updaterOptions.showpopup&&alert(localized[5])}}else a.tagName=="error"?this.setStatus(NodeUtils.getNodeValue(a,"descr")):this.setStatus("reconnecting")}});
function togglemenu(){if($("sidebar")&&$("wcontent")&&$("togglemenu"))if($("wcontent").className=="contentnomenu"){$("sidebar").style.display="block";$("wcontent").className="contentinner";$("togglemenu").innerHTML=localized[4]}else{$("sidebar").style.display="none";$("wcontent").className="contentnomenu";$("togglemenu").innerHTML=localized[3]}}var webimRoot="";Behaviour.register({"#togglemenu":function(a){a.onclick=function(){togglemenu()}}});
EventHelper.register(window,"onload",function(){webimRoot=updaterOptions.wroot;new Ajax.ThreadListUpdater({table:$("threadlist"),status:$("connstatus"),istatus:0}.extend(updaterOptions||{}));updaterOptions.havemenu||togglemenu()});
