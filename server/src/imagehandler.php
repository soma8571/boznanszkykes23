<?php

//Thumbnail méretek
define('THUMBNAIL_WIDTH', 240);
define('THUMBNAIL_HEIGHT', 115);
define('THUMBNAIL_WIDTH_SMALL', 240);
define('THUMBNAIL_HEIGHT_SMALL', 135);
define('THUMBNAIL_WIDTH_MEDIUM', 320);
define('THUMBNAIL_HEIGHT_MEDIUM', 180);

class Image {
 	
    var $image;
    var $image_type;
    
    function createThumbnail($filepath, $thumbnail_path) {
   
       if (!empty($filepath)) {
           
           $temp = explode(".", $filepath);
           $picture_type = end($temp);
           
           switch(strtolower($picture_type)) {
               case "jpg":
                   $file_res = imagecreatefromjpeg($filepath);
                   break;
               case "png":
                   $file_res = imagecreatefrompng($filepath);
                   break;		
               case "gif":
                   $file_res = imagecreatefromgif($filepath);
                   break;
           }
           
           $source_width = imagesx($file_res);
           $source_height = imagesy($file_res);
           
           if ($source_width > $source_height) {
               
               //a width a config.php-ban megadott konstans értéket veszi fel, a height-et pedig számoljuk hozzá
               $dest_width = THUMBNAIL_WIDTH;
               $ratio = $source_width / $source_height;
               $dest_height = $dest_width / $ratio;
           
           } elseif ($source_width == $source_height) {
               
               $dest_width = THUMBNAIL_WIDTH;
               $dest_height = THUMBNAIL_HEIGHT;	
   
           } else {
               
               //a height a config.php-ban megadott konstans értéket veszi fel, a width-t pedig számoljuk hozzá
               $dest_height = THUMBNAIL_HEIGHT;
               $ratio = $source_width / $source_height;
               $dest_width = $dest_height * $ratio;
           }
                   
           $thumbnail = imagecreatetruecolor($dest_width, $dest_height);
           imagecopyresampled($thumbnail, $file_res, 0, 0, 0, 0, $dest_width, $dest_height, $source_width, $source_height);
           
           //itt még többi típusok!
           switch(strtolower($picture_type)) {
               case "jpg":
                   imagejpeg($thumbnail, $thumbnail_path, 100);
                   break;
               case "png":
                   imagepng($thumbnail, $thumbnail_path, 9);
                   break;
               case "gif":
                   imagegif($thumbnail, $thumbnail_path);
                   break;	
           }
           
       }
           
   }
   
   function resizeImage($filepath, $destPath, $maxWidth, $maxHeight) {
       
       if (!empty($filepath)) {
           
           $temp = explode(".", $filepath);
           $picture_type = end($temp);
           
           switch(strtolower($picture_type)) {
               case "jpg":
                   $file_res = imagecreatefromjpeg($filepath);
                   break;
               case "png":
                   $file_res = imagecreatefrompng($filepath);
                   break;		
               case "gif":
                   $file_res = imagecreatefromgif($filepath);
                   break;
           }
           
           $source_width = imagesx($file_res);
           $source_height = imagesy($file_res);
           
           if ($source_width > $source_height) {
               
               //a width a config.php-ban megadott konstans értéket veszi fel, a height-et pedig számoljuk hozzá
               $dest_width = $maxWidth;
               $ratio = $source_width / $source_height;
               $dest_height = $dest_width / $ratio;
           
           } elseif ($source_width == $source_height) {
               
               $dest_width = $maxWidth;
               $dest_height = $maxHeight;	
   
           } else {
               
               //a height a config.php-ban megadott konstans értéket veszi fel, a width-t pedig számoljuk hozzá
               $dest_height = $maxHeight;
               $ratio = $source_width / $source_height;
               $dest_width = $dest_height * $ratio;
           }
                   
           $thumbnail = imagecreatetruecolor($dest_width, $dest_height);
           imagecopyresampled($thumbnail, $file_res, 0, 0, 0, 0, $dest_width, $dest_height, $source_width, $source_height);
           
           //itt még többi típusok!
           switch(strtolower($picture_type)) {
               case "jpg":
                   imagejpeg($thumbnail, $destPath, 100);
                   break;
               case "png":
                   imagepng($thumbnail, $destPath, 9);
                   break;
               case "gif":
                   imagegif($thumbnail, $destPath);
                   break;	
           }
           
       }
       
   }
   
   function createThumbnail_16_9($filepath, $thumbnail_path, $wanted_width, $wanted_height) {
   
       if (!empty($filepath)) {
           
           $temp = explode(".", $filepath);
           $picture_type = end($temp);
           
           switch(strtolower($picture_type)) {
               case "jpg":
                   $file_res = imagecreatefromjpeg($filepath);
                   break;
               case "png":
                   $file_res = imagecreatefrompng($filepath);
                   break;		
               case "gif":
                   $file_res = imagecreatefromgif($filepath);
                   break;
           }
           
           $source_width = imagesx($file_res);
           $source_height = imagesy($file_res);
           
           /*
           $wanted_width = 240;
           $wanted_height = 135;
           */
           
           $wantedRatio = $wanted_width / $wanted_height;
           
           $sourceRatio = $source_width / $source_height;
           
           if ($wantedRatio > $sourceRatio) {
               
               $ratioWantedHeight = ($wanted_height * $source_width) / $wanted_width;
               
               $source_y = ($source_height - $ratioWantedHeight) /2;
               
               $thumbnail = imagecreatetruecolor($wanted_width, $wanted_height);
               imagecopyresampled($thumbnail, $file_res, 0, 0, 0, $source_y, $wanted_width, $wanted_height, $source_width, $ratioWantedHeight);
                   
           } else if ($wantedRatio < $sourceRatio) {
               
               $ratioWantedWidth = ($wanted_width * $source_height) / $wanted_height;
               
               $source_x = ($source_width - $ratioWantedWidth) / 2;
           
               $thumbnail = imagecreatetruecolor($wanted_width, $wanted_height);
               imagecopyresampled($thumbnail, $file_res, 0, 0, $source_x, 0, $wanted_width, $wanted_height, $ratioWantedWidth, $source_height);	 
           }
                   
           //itt még többi típusok!
           switch(strtolower($picture_type)) {
               case "jpg":
                   imagejpeg($thumbnail, $thumbnail_path, 100);
                   break;
               case "png":
                   imagepng($thumbnail, $thumbnail_path, 9);
                   break;
               case "gif":
                   imagegif($thumbnail, $thumbnail_path);
                   break;	
           }
           
       }
           
   }
}

?>