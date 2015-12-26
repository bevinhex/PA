import Ember from 'ember';

export default Ember.Component.extend({
  editor: null,
  _suspendValueChange: false,
  isElementInserted: false,
	classNames:'editer-view',

  didInsertElement: function() {
      var self = this;
  
      this.set('isElementInserted', true);
  
      if (window.isLoadingRte) {
	        var interval = setInterval(function() {
			        if (window.isLoadingRte === false) {
					          clearInterval(interval);
					          self.initTinyMce();
					        }
			      }, 200);
	  
	        return;
	      }
  
      if (window.tinymce) {
	        this.initTinyMce();
	      }
      else {
	        window.isLoadingRte = true;
	        window.isLoadingRte = false;
	        self.initTinyMce();
		}
    },

  initTinyMce: function() {
      var self = this;
  
      if (this.get('isElementInserted') !== true) {
	        return;
	      }
  
      if (window.tinymce) {
	        window.tinymce.init({
			    selector: "#statement",
				setup:function(ed){
				   	self.set("editor", ed);
				    ed.on("keyup change", function() {
					     self.suspendValueChange(function() {
							 self.set("value", ed.getContent());
						});
					});
					ed.on('init',function(arg){
						ed.setContent(self.get('value'));
					}),
					ed.on('NodeChange',function(edd, cm, e){
						self.fixToolbarLocation();
					});

					ed.on('blur',function(e){
						self.finishEditing();
					});
				},
			    inline: true,
				format:'raw',
				trusted:true,
				plugins: [
					    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
				    'searchreplace wordcount visualblocks visualchars code fullscreen',
				    'insertdatetime media nonbreaking save table contextmenu directionality',
				    'emoticons template paste textcolor colorpicker textpattern imagetools'
				],
				toolbar1: 'insertfile undo redo | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
				toolbar2: 'styleselect | bold italic | forecolor backcolor emoticons|fontselect | fontsizeselect | print media ',
			    skin: 'lightgray',
			    theme : 'modern',
				fixed_toolbar_container:'#toolbar',
				content_css:'tinymce/content.css',
				readonly:1,
			    toolbar_items_size: 'small'
				});
	      }
    },
  suspendValueChange: function(cb) {
      this._suspendValueChange = true;
      cb();
      this._suspendValueChange = false;
    },
	valueChanged: function() {
      if (this._suspendValueChange) {
	        return;
	      }
      var content = this.get("value");
  
      if (Ember.isPresent(content)) {
	        this.get("editor").setContent(content);
	      }
    }.observes("value"),

	willClearRender: function() {
      this.set('isElementInserted', false);
      var self = this;
      setTimeout(function() {
			var editor = self.get("editor");
			if(editor==null)
			{
				setTimeout(function(){
					self.get('editor').remove();
				},250);
			}
			editor.remove();
	      }, 250);
    },
	fixToolbarLocation(){
		var selectionTop = 0;
		var editor = tinymce.activeEditor;
		var rects = editor.selection.getRng().getClientRects();
		if(rects.length>0)
		{
			for(var i=0;i<rects.length;i++)
			{
				selectionTop += rects[i].top;
			}
			selectionTop = selectionTop/rects.length;
		}
		else
		{
			selectionTop = editor.selection.getNode().getBoundingClientRect().top;
		}
		var toolbar = $(document.querySelector('#toolbar'));
		if(selectionTop<tinymce.activeEditor.bodyElement.offsetHeight/2)
		{
			toolbar.css('top','calc(100% - ' + toolbar.height() + 'px )');
			$('body').addClass('toolbar-bottom');
		}
		else
		{
			toolbar.css('top','0px');
			$('body').removeClass('toolbar-bottom');
		}
	},
	finishEditing(){
		tinymce.activeEditor.readonly = 1;
		tinymce.activeEditor.getBody().setAttribute('contenteditable',false);
		this.get('onBlur')();
	},
	actions:{
		editStatement(){
			var editor = tinymce.activeEditor;
			if(editor.readonly==0)
			{
				return;
			}
			editor.getBody().setAttribute('contenteditable',true);
			editor.readonly = 0;
			editor.fire('focus')
			editor.selection.collapse()
		}
	}
});
