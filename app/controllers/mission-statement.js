import Ember from 'ember';

export default Ember.Controller.extend({
	init(){
		var self = this;
		tinymce.init({
			selector:'#statement',
			setup:function(ed){
				ed.on('NodeChange',function(ed, cm, e){
					self.fixToolbarLocation()
				})

				ed.on('blur',function(e){
					self.finishEditing();
				})
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
		})
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
		//var statement = new msResource({'id':$scope.statement_id,'statement':$scope.statement});
		//statement.$save();
	},
	actions:{
		editStatement:function(){
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
