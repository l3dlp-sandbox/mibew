/*
 Copyright 2005-2014 the original author or authors.

 Licensed under the Apache License, Version 2.0 (the "License").
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
*/
(function(b,d,f){b.Views.SendMailControl=b.Views.Control.extend({template:d.templates["chat/controls/send_mail"],events:f.extend({},b.Views.Control.prototype.events,{click:"sendMail"}),sendMail:function(){var a=this.model.get("link"),c=b.Objects.Models.page;if(a){var d=this.model.get("windowParams"),c=c.get("style"),e="";c&&(e=(-1===a.indexOf("?")?"?":"&")+"style="+c);a=a.replace(/\&amp\;/g,"&")+e;a=window.open(a,"ForwardMail",d);null!==a&&(a.focus(),a.opener=window)}}})})(Mibew,Handlebars,_);
