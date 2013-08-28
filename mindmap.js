var API_4_MINDMAP = function(){  //singleton - при многократном запуске инициализируется единожды
	 if ( (typeof arguments.callee.instance=='undefined') ) { //если объект ещё не создан
		 arguments.callee.instance = new function() {
		     var this_api = this; //кэшируем самого себя, чтобы использовать внутри функций

		     var my_all_data = {}; //главный массив с данными
		      
		     var my_all_data_template = { //задаём первоначальные данные, если это первый запуск
				 "n1":{ id:1, parent_id:0, title:"Карта ума<br>своими руками<br>"+
    			 "с хранением данных<br>в браузере.<br>Javascript" },
    			 "n2":{ id:2, parent_id:1, title:"Изучим", icon:"icon-gift" },
    			 "n3":{ id:3, parent_id:2, title:"Рисуем линии между элементами", icon:"icon-flow-line" }, 
    			 "n5":{ id:5, parent_id:3, title:"Используем плагин jsPlumb", icon: "icon-link" }, 
    			 "n4":{ id:4, parent_id:3, title:"Каждая линия - отдельный SVG" }, 
    			 "n7":{ id:7, parent_id:6, title:"Используем плагин jQuery ContextMenu", icon: "icon-link" }, 
    			 "n8":{ id:8, parent_id:1, title:"Объём кода", icon: "icon-lamp" }, 
    			 "n9":{ id:9, parent_id:8, title:"Javascript + jQuery — 520 строк" },
    			 "n10":{ id:10, parent_id:2, title:"Сохраненяем данные в браузере", icon: "icon-floppy-1" },
    			 "n11":{ id:11, parent_id:17, title:"IndexedDB" },
    			 "n12":{ id:12, parent_id:17, title:"webSQL" },
    			 "n13":{ id:13, parent_id:17, title:"LocalStorage" },
    			 "n14":{ id:14, parent_id:10, title:"Используем плагин Ydn.db", icon: "icon-link" },
    			 "n15":{ id:15, parent_id:10, title:"Объём данных не ограничен" },
    			 "n16":{ id:16, parent_id:2, title:"Используем синглтон в Javascript", icon: "icon-cd" },
    			 "n17":{ id:17, parent_id:10, title:"Доступны" },
    			 "n18":{ id:18, parent_id:6, title:"Динамическое добавление пунктов" },
    			 "n20":{ id:20, parent_id:8, title:"CSS — 220 строк" },
    			 "n19":{ id:19, parent_id:8, title:"HTML — 50 строк" },
    			 "n22":{ id:22, parent_id:16, title:"Это позволяет избежать глобальных переменных" },
    			 "n23":{ id:23, parent_id:16, title:"Наводим порядок среди функций" },
    			 "n24":{ id:24, parent_id:2, title:"Используем иконочный шрифт", icon: "icon-emo-wink" },
    			 "n6":{ id:6, parent_id:2, title:"Контекстное меню", icon: "icon-list" }, 
    			 "n25":{ id:25, parent_id:24, title:"Используем набор шрифтов Fontello", icon: "icon-link" },
    			 "n27":{ id:27, parent_id:2, title:"Drag&Drop jQuery UI", icon: "icon-link" },
    			 "n26":{ id:26, parent_id:24, title:"Векторные иконки с идеальным сглаживанием" }
    		   };
		 	
		 	 this.jsSaveAllToDB = function() { //сохраняем весь массив в базу данных
			 	 $.each(my_all_data, function(i, el){
		       		db.put("mindmap_db", el ).done(function(){ 
		       		});
			 	 });
		 	 }

		 	 this.jsLoadAllFromDB = function() { //загружаем весь массив из базы данных браузера или из массива
			 	 var d=new $.Deferred(); //объект позволяющий работать асинхронно

		 	 	 my_all_data = {}; //обнуляем данные
	    		 db.values("mindmap_db",null,99999999).done(function(records) {
	    		 	if(records.length) {
	    		 	$.each(records, function(i, el){
		    		 	my_all_data["n"+el.id] = {};
		    		 	my_all_data["n"+el.id] = el;
	    		 	});
	    		 	} else { //если это первый запуск, заполняю данные по шаблону и сохраняю в базе данных
		    		 	my_all_data = my_all_data_template;
		    		 	this_api.jsSaveAllToDB();
	    		 	}
	    		 	d.resolve(); //выполняем обещание, при этом выполнится функция done
	    		 });
	    		 
	    		 return d.promise(); //говорим, что скоро выполним обещание, когда всё загрузится

		 	 }
		 	
		 	 this.jsFind = function(id, changes) { //возвращаем элемент с id или меняем его параметры
		 	 	
		 	 	 //находим элемент в массиве объектов, буква n нужна для отработки отрицательных id
		 	 	 var answer = my_all_data["n"+id]; 
		 	 	 if(!answer) return false; //если элемента в массиве нет
		 	 
		 	 	 if(changes) { //если нужно внести изменения, присваиваем их по очереди
			 	 	 $.each(changes, function(name_field, new_field_value){
				 	 	 answer[name_field] = new_field_value;
			 	 	 });
		       		 
		       		 db.put("mindmap_db", answer ).done(function(){ //асинхронно сохраняем данные в базе браузера
		       		 	console.info("Изменения сохранены в базу данных браузера"); //выводим в консоль браузера
		       		 });
			 	 	 
		 	 	 }
			 	 return answer;
		 	 }
		 	 
		 	 this.jsFindByParent = function(parent_id) { //подбираем всех детей родителя parent_id
		 	 	 var answer = [];
			 	 $.each(my_all_data, function(i,el){ //фильтруем все неудалённые элементы с родителем = parent_id
				 	if((el.parent_id == parent_id) && (!el.del)) answer.push(el);
			 	 });
			 	 return answer;
		 	 }
		 	 
		 	 this.jsAddNew = function(parent_id, title) { //добавляем нового ребёнка родителю parent_id
		 	 	var max_id = 0;
		 	 	$.each(my_all_data, function(i,el){ //находим максимальный id
			 	 	if(el.id>max_id) max_id = el.id;
		 	 	});
		 	 	var new_id = (parseInt(max_id)+1); //новый неиспользованный id
		 	 	my_all_data["n"+new_id] = {}; //создаём новый объект
		 	 	my_all_data["n"+new_id] = {id:new_id, parent_id: parent_id, title: title}; //присваиваем заголовок
		 	 	
		 	 	return new_id;
			 }
			 
		 	 //рекурсивно перебирает ВСЕХ детей, внуков и так далее
		 	 this.jsRecursiveByParent = function(id, recursive_array) {
		 	   if(!recursive_array) recursive_array = [];
		 	   
		 	   var answer = this_api.jsFindByParent(id);
		 	   
		 	   $.each(answer,function(i,el) { //обходим все элементы и вызываем сами себя, пока есть дети
		 	   	   recursive_array.push(el);
		 	       recursive_array = this_api.jsRecursiveByParent(el.id, recursive_array);
		 	   });
		 	 return recursive_array;
		 	 }
		 	 

		 	 this.jsDeleteById = function(id) { //удаляем всех детей и потомков этого родителя
		 	 	 if(confirm("Удалить элемент №"+id+" и его содержимое?")) {
		 	 	 	var childs = this_api.jsRecursiveByParent(id);
		 	 	 	$.each(childs, function(i, el){
		 	 	 		api4mindmap.jsFind(el.id, {del:1}); //"джихад" - сначала удаляем детей и всех потомков
		 	 	 	});
		 	 	 	if(id!=1) api4mindmap.jsFind(id, {del:1}); //потом родителя, если это не №1
		 	 	 }
		 	 }
		 	 
		 	 this.jsRenderAllMap = function(focus_id) { //выводим все элементы карты на экран
		 	 	 if(!focus_id) focus_id = 1;
			 	 var html = "<ul myid='"+focus_id+"'>";
			 	 html = this_api.jsRenderOneParent(focus_id, html); //рекурсивная функция
			 	 html += "</ul>";
			 	 $("#mindmap").html(html);
			 	 jsMakeDroppable(); //делаем новые элементы перетаскиваемыми
		 	 }
		 	 
		 	 this.jsRenderOneParent = function(parent_id, html) { //рисуем элемент и всех потомков
			 	 html += "<li id='node_"+parent_id+"' myid='"+parent_id+"'>";
			 	 html += "<div class='big_n_title'>";
			 	 html += this_api.jsRenderOneElement(parent_id); //рисуем сам элемент
			 	 html += "</div>";
			 	 
			 	 var childs = this_api.jsFindByParent(parent_id); //подбираем всех детей
			 	 if(childs.length) {
				 	 html += "<ul class='childs' myid='"+parent_id+"'>";
			 	 }
			 	 $.each(childs, function(i,el){
				 	html = this_api.jsRenderOneParent(el.id,html); //рекурсивно вызываем сами себя, пока есть дети
			 	 });
			 	 if(childs.length) {
				 	 html += "</ul>";
			 	 }
			 	 
			 	 html += "</li>";
			 	 return html;
		 	 }
		 	 
		 	 
		 	 this.jsRenderOneElement = function(id) { //рисуем один элемент
		 	 	 var element = this_api.jsFind(id); //сам элемент
		 	 	 var childs_count = this_api.jsFindByParent(id).length; //кол-во детей у элемента

		 	 	 var icon_type = '';
		 	 	 if(element.icon) icon_type = element.icon; //если сохранена иконка, используем её
		 	 	 
		 	 	 if(childs_count>0) { //если это папка
		 	 	 	var collapser_html = "<div class='collapse'></div>"; //круглый минус или плюс, для сворачивания
			 	 	var icon = "<div class='type_icon'><i class='icon-folder-1 folder'><div class='count'>"+
			 	 		childs_count+"</div></i><i class='"+icon_type+"'></i>"+"</div>";
		 	 	 } else {
			 	 	var collapser_html = "";
			 	 	var icon = "<div class='type_icon'><i class='"+icon_type+"'></i></div>";
		 	 	 }
		 	 	 
			 	 var answer = icon+"<div class='n_title' contenteditable='true'>"+element.title+
			 	 			       "</div><div class='contextmenu'></div>"+collapser_html;
			 	 return answer; 
		 	 }
		   	 	
			 this.jsDrawMindmap = function(focus_id) { //функция рисует линии между элементами
			 
			    var line_cache = [];
			    
			    $("#mindmap ul:visible").each(function(){ //исключаем свёрнутые списки ul
			    	var ul_id = $(this).attr("myid");
			    	var childs = this_api.jsFindByParent(ul_id);

			     	$.each(childs, function(i,el){ //для наглядности, сначала заполняем массив нужных линий
			    	 	var target = el.id;
			    	 	if(!$("li[myid='"+target+"']"+" .big_n_title:first").hasClass("_jsPlumb_endpoint_anchor_")) {
			    		 	var parent_id = el.parent_id;
			    		 	line_cache.push( {source: parent_id, target: target} );
			    	 	}
			     	});
			    });
			    
			    if(line_cache.length) { //запускаем кеширование отрисовки линий, чтобы всё происходило быстрее
			     	if(!myjsPlumb.isSuspendDrawing()) {
			     		myjsPlumb.setSuspendDrawing(true, true);
			     		console.info("set_suspend");
			     	}
			    }
			    
			    
			    $.each(line_cache, function(i, el){
				      
				      if(el.source == 1) { //у первого элемента линия начинается с половины высоты
				      	anchor1 = [ 1, 0.5, 1, 0, -1, -1 ];
				      } else {
				      	anchor1 = [ 1, 1, 1, 0, -1, -1 ]; //линия идёт с низа
				      }
			    
					  //первая точка для линии:
		    	      var p1 = myjsPlumb.addEndpoint("node_"+el.source+" .big_n_title:first", 
		    	      		                        { anchor: anchor1 });			    	      
		    	      //вторая точка для линии:		                        
		    	      var p2 = myjsPlumb.addEndpoint("node_"+el.target+" .big_n_title:first", 
		    	      								{ anchor: [ 0, 1, -1, 0, 1, -1 ]});
					  //сколько детей у элемента:
					  var count = this_api.jsFindByParent(el.source).length;

					  if(count>10) { //если больше десяти, то линии будут прямыми
			    	      var LineType = "Straight";
					  } else {
			    	      var LineType = "Bezier"; //кривая линия Безье
					  }
			    	  
			    	  //соединяем две точки, которые определили выше  
			  		  myjsPlumb.connect({source: p1, target: p2, scope:"someScope", 
			  		  					deleteEndpointsOnDetach:true, connector:[ LineType, 
			  		  					{ curviness: 30, cornerRadius: 20 } ]});
			   });
			 } //jsDrawMindmap
		   	 	
		   	 this.jsRefreshMindmap = function() { //быстрое обновление всей карты на экране с сохранением состояния
		   	 	 myjsPlumb.reset(); //стираем все линии
		   	 	 var save_scroll_top = $("#mindmap").scrollTop();  //сохраняем позиции скроллинга, чтобы вернуть
		   	 	 var save_scroll_left = $("#mindmap").scrollLeft();//всё как было после перереисовки
		   	 	 
		   	 	 var hidden_elements = []; //массив хранения свёрнутых элементов
		   	 	 
		   	 	 $(".hide").each(function(){
			   	 	hidden_elements.push($(this).attr("myid"));
		   	 	 });
		   	 	 
			   	 api4mindmap.jsRenderAllMap(1); //перерисовываем всю карту заново

		   	 	 $.each(hidden_elements, function(i, el){ //скрываем элементы, которые были скрыты до.
			   	 	$("#node_"+el).addClass("hide");
		   	 	 });
		   	 	 
		   	 	 api4mindmap.jsDrawMindmap(1);  //намечаем линии, взяв видимые узлы с экрана
		   	 	 onResize(); //запускаем отрисовку закешированных линий
		   	 	 
		   	 	 $("#mindmap").scrollTop(save_scroll_top);  //сохраняем позиции скроллинга, чтобы вернуть
		   	 	 $("#mindmap").scrollLeft(save_scroll_left);//всё как было после перереисовки

		   	 }
		   	 	
		 	 this.jsRegAllKeys = function() { //регистрируем клики в элементы

			 	 $("#mindmap").on("keydown", ".n_title", function(e){ //отработка нажатия Enter
					 
			 	 	 if(e.keyCode==13) {
				 	 	e.preventDefault();
			 	 	 	$(this).blur(); //уводим фокус, при этом автоматом сохраняются данные
			 	 	 }
			 	 });

			 	 $("#mindmap").on("keyup", ".n_title", function(e){
					 e.preventDefault();
			 	 	 if(e.keyCode==13) $(this).blur(); 
				 	 onResize(); //перерисовываем линии, так как всё, скорее всего, сдвинулось
			 	 });

			 	 $("#mindmap").on("blur", ".n_title", function(){ //при уводе фокуса, сохраняем заголовок
			 	 	 var n_title_text = $(this).html();
			 	 	 var id = $(this).parents("li:first").attr("myid");
			 	 	 if(n_title_text.length==0) n_title_text = "Новый элемент"; //если всё стёрли, заголовок по умолч.
			 	 	 $(this).html( strip_tags(n_title_text) ); //убираем теги и переносы строк
			 	 	 this_api.jsFind(id, {title:n_title_text}); //сохраняем новый заголовок в массиве и базе данных
				 	 onResize(); //перерисовываем линии
			 	 });

			 	 $("#mindmap").on("click", ".n_title", function(){ //при клике в заголовок, фокусируемся
			 	 	$(this).focus();
			 	 });

			 	 $("#mindmap").on("focus", ".n_title", function(){ //при фокусе, выделяем весь текст
			 	 	var ntitle = $(this);
 	 		 	  	setTimeout(function(){ 
		 	  		if(ntitle.is(":focus")) document.execCommand('selectAll',false,null); 
		 	  		},3); //нужна задержка перед выделением всего текста специально для Firefox

			 	 });
			 	 
			 	 $("#mindmap").on("click", ".collapse", function(){ //при сворачивании и разворачивании узлов
			 	 	$(this).parents("li:first").toggleClass("hide"); //инвертирует класс
			 	 	api4mindmap.jsDrawMindmap(1);  //дорисовываем линии, которых нет
			 	 	onResize();
			 	 	return false;
			 	 });

			 	 var font_size = 14; //шрифт по умолчанию
			 	 $("#zoom_in").on("click", function(){ //кнопка увеличения масштаба
			 	 	font_size += 1;
			 	 	$("#mindmap").css("font-size", font_size+"px");
			 	 	onResize();
			 	 	return false;
			 	 });
			 	 $("#zoom_out").on("click", function(){ //кнопка уменьшения масштаба
			 	 	font_size -= 1;
			 	 	$("#mindmap").css("font-size", font_size+"px");
			 	 	onResize();
			 	 	return false;
			 	 });
			 	 
			 	 $("#collapse_all").on("click", function(){ //кнопка "свернуть все элементы"
			 	 	$("#node_1 ul li").addClass("hide");
			 	 	onResize();
			 	 	return false;
			 	 });

			 	 $("#expand_all").on("click", function(){ //кнопка "развернуть все элементы"
			 	 	$("#node_1 ul li").removeClass("hide"); 
			 	 	onResize();
			 	 	return false;
			 	 });
			 	 

		 	 } //jsRegAllKeys
		   	 	
		   	 	
		 }
     }
     return arguments.callee.instance; //возвращаем все функции
}

function onResize() {
	myjsPlumb.setSuspendDrawing(false, true); //перерисовывает закешированные линии
}

function jsGetIcons(n) { //формируем многоуровневое меню иконок
	var icons = {};
	
    icons[0] = ["progress-0","progress-1","progress-2","progress-3","dot","dot-2","dot-3","star-empty","star","record"];
    icons[1] = ["check","heart-empty","heart","bookmark-empty","bookmark","ok-2","help","wallet","mail-2","cloud"];
    icons[2] = ["tree","chat-2","article-alt","volume","flash","aperture-alt","layers","steering-wheel","skiing","flight"];
    icons[3] = ["lock-open","lock","umbrella","camera","book-open","clock-1","plus","minus","trash","music"];
    icons[4] = ["calculator","address","pin","vcard","basket-1","swimming","youtube","leaf","mic","target"];
    icons[5] = ["monitor","phone","download","bell","at","pause","play","stop-1","flag","key"];
    icons[6] = ["users-1","eye","inbox","brush","moon","college","fast-food","coffee","top-list","bag"];
    icons[7] = ["chart-area","info","home-1","hourglass","attention","scissors","tint","guidedog","archive","flow-line"];
    icons[8] = ["emo-grin","emo-happy","emo-wink","emo-sunglasses","emo-thumbsup","emo-sleep","emo-unhappy","emo-devil","emo-surprised","emo-tongue"];
    icons[9] = ["plus","minus","keyboard","fast-fw","to-end","to-start","cancel-circle","check","flash","feather"];
    icons[10] = ["plus-circle","pencil-alt","target-1","chart-pie","adjust","user-add","volume","install","flow-cascade","sitemap"];
    icons[11] = ["minus-circle","clock-1","light-down","light-up","lamp","upload","picture-2","dollar","gift","link-1"];
			
	answer = {};	

	$.each(icons, function(j, icon_group){
		sub_icons = {};
		$.each(icons[j], function(i, icon){
			sub_icons["icon-"+icon] = {};
			sub_icons["icon-"+icon] = {name:icon, icon: "icon-"+icon};
		});

		answer["icon-group"+icon_group]	= {};
		answer["icon-group"+icon_group]	= {name:"Набор №"+(parseInt(j)+1), icon: "icon-"+icons[j][0], items: sub_icons};
		
	});	
			
	return answer; //создали элемент для контекстного меню
}

function jsMakeDroppable() { //делаем все элементы перетаскиваемыми

		$(".n_title").not("ui-draggable").draggable({
				zIndex: 999,
				delay:50,
				revert: false,      // will cause the event to go back to its
				helper:"clone",
				appendTo: "body",
				refreshPositions:true
			});

		$( ".n_title" ).not("ui-droppable").droppable({
			accept: ".n_title",
			activeClass: "ui-can-recieve",
			tolerance: "pointer",
			hoverClass: "ui-can-hover",
			over: function (event, ui) {
				//$(this).click();
				},
            drop: function( event, ui ) {
            	//console.info("drop-all",usedOverlays,ui,ui.draggable[0] );
            	
            	var my_draggable = $(ui.draggable[0]);
            	var my_droppable = $(event.target);
            	
            	my_draggable_id = my_draggable.parents("li:first").attr("myid");
            	my_droppable_id = my_droppable.parents("li:first").attr("myid");
            	
            	if( jsCanDrop(my_draggable_id, my_droppable_id) ) { //проверяем, чтобы небыло зацикливаний
					api4mindmap.jsFind(my_draggable_id, {parent_id:my_droppable_id});
					api4mindmap.jsRefreshMindmap();
	   				$(".ui-draggable-dragging").remove(); //удаляем клон объекта, который перетаскивали

            	} else {
					alert("Не могу перенести элемент внутрь самого себя");
            	}
            	
				}
			});

}

function jsCanDrop(draggable_id, droppable_id) { //предотвращаем зацикливание, чтобы родитель не был внуком своих детей
	var can_drop = true;
	var all_childs = api4mindmap.jsRecursiveByParent(my_draggable_id);
	$.each(all_childs, function(i,el){
		console.info(el.id, droppable_id);
		if(el.id == droppable_id) 
			can_drop = false;
	});
	
	if(draggable_id == droppable_id) var can_drop = false;
	
	return can_drop;
}

// чистим ввод текста от тегов
function strip_tags( str ){	
	if(!str) return "";
	answer = str.replace(/<\/?[^>]+>/gi, '');
	answer = answer.replace(/\n/gi, '');
	return answer;
}

var myjsPlumb; //глобальный объект для рисования
///////////////////////запускается после загрузки html страницы////////////////////////
function jsDoFirst() { 
	api4mindmap = new API_4_MINDMAP(); //регистрируем собственное api из "синглтона"

	jsPlumb.Defaults.Container = $("#mindmap"); //параметры "рисовальщика" линий
    myjsPlumb = jsPlumb.getInstance({
    	DragOptions: { cursor: 'pointer', zIndex: 2000 },
    	PaintStyle:{ 
    	  lineWidth:1, 
    	  strokeStyle:"#888"
    	},
    	Connector:[ "Bezier", { curviness: 30 } ],
    	Endpoint:[ "Blank", { radius:5 } ],
    	EndpointStyle : { fillStyle: "#567567"  },
    	Anchors : [[ 1, 1, 1, 0, -1, -1 ],[ 0, 1, -1, 0, 1, -1 ]]
    });
    
    var icons_html = jsGetIcons(0); //берём все иконки и их группы для контекстного меню

	$.contextMenu({ //генерируем контекстное меню заранее и назначаем на левый клик в .contextmenu
        selector: '.contextmenu', 
        trigger: 'left',
        callback: function(key, options) {
        	var id = $(this).parents("li:first").attr("myid");
            if( /icon-/ig.test(key) ) { //назначаем иконку
            	api4mindmap.jsFind(id, {icon:key});
	            api4mindmap.jsRefreshMindmap();
            } else if(key == "delete") { //удаляем элемент и потомков
	           api4mindmap.jsDeleteById(id);
	           api4mindmap.jsRefreshMindmap(id);
            } else if(key == "add_down") { //добавляем вниз
            	var parent_id = api4mindmap.jsFind(id).parent_id;
	            var new_id = api4mindmap.jsAddNew(parent_id, "Новый элемент");
	            api4mindmap.jsRefreshMindmap();
	            $("#node_"+new_id+" .n_title").focus();
            } else if(key == "add_right") { //добавляем внутрь
	            var new_id = api4mindmap.jsAddNew(id, "Новый элемент");
	            $(this).parents("li").removeClass("hide");
	            api4mindmap.jsRefreshMindmap();
	            $("#node_"+new_id+" .n_title").focus();
            }
        },
        delay:0,
        items: {
        	"add_down": {"name":"Добавить вниз", "icon": "icon-down-1"},
        	"add_right": {"name":"Добавить вправо", "icon": "icon-right-1"},
        	"sep1": "--------",
        	"delete": {"name":"Удалить", "icon": "icon-trash"},
            "context_make_did1011": {"name": "Иконка", "icon": "icon-emo-wink", 
	            "items": icons_html //сгенерированные пункты меню с иконками
            }
		}
		});	
	
  	//схема структуры базы данных
  	var mindmap_store_schema = { //схема базы данных
  	  name: "mindmap_db",  //название таблицы
  	  keyPath: 'id', // ключ по которому мы будем искать данные, 
  	  autoIncrement: false 
  	};
  	
  	var schema = { //все схемы таблиц
  	  stores: [mindmap_store_schema]
  	}; 
  		  	
  	if( navigator.userAgent.toLowerCase().indexOf("android") !=-1 ) {	  	
  		var options = {mechanisms: ['websql', 'indexeddb']};  //предпочитать websql в андроид
    } else {
    	var options = {}; //предпочитать indexeddb он быстрый и асинхронный), а потом уже все остальные
    }
	
	db = new ydn.db.Storage('_all_mindmap', schema, options); //инициализируем базу данных браузера

	api4mindmap.jsLoadAllFromDB().done(function(){ //асинхронный вызов загрузки данных из базы данных браузера
		api4mindmap.jsRegAllKeys();    //регистрируем клавиши
		api4mindmap.jsRenderAllMap(1); //рисуем карту для узла №1
		api4mindmap.jsDrawMindmap(1);  //рисуем линии, беря видимые узлы с экрана
	 	onResize(); //перерисовываем линии
	}); //загружаем весь массив из базы данных браузера
	
}
