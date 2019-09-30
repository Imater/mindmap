<?php
function save($data) {
    if(!empty($data) and $data!='undefined'){
        $data=json_decode($data,1);
        foreach($data as $k=> $v ) {
            if($v['del']==1) {
                unset($data[$k]);
            }
        }
        $data_insert='<?php $db='.var_export($data,1).';';
        file_put_contents('db_content.php',$data_insert);
    }
}
//file_put_contents('db_content.log', var_export($_REQUEST,1));

//выбираем метод
switch($_REQUEST['method']){
    case 'save':
        //сохраняем данные
        save($_REQUEST['data']);
        break;
    case 'getData':
        //получаем данные
        if(file_exists(db_content.php)) {
            require_once'db_content.php';
        }
        if(empty($db)){
            $db=array (
  'n1' => 
  array (
    'id' => 1,
    'parent_id' => 0,
    'title' => 'Карта ума<br>своими руками<br>с хранением данных<br>в файле<br> PHP + Javascript',
  ),);
        }
        $result=json_encode($db);
        echo $result;
        break;
}
?>    