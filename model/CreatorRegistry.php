<?php
/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 * 
 * Copyright (c) 2014 (original work) Open Assessment Technologies SA;
 * 
 */

namespace oat\qtiItemPic\model;

use \tao_models_classes_service_FileStorage;
use \common_ext_ExtensionsManager;

/**
 * The hook used in the item creator
 *
 * @package qtiItemPci
 */
class CreatorRegistry
{
    
    /**
     * The singleton
     * 
     * @var CreatorRegistry 
     */
    protected static $instance;
    
    /**
     * @return tao_models_classes_service_FileStorage
     */
    public static function singleton(){

        if(is_null(self::$instance)){
            self::$instance = new self();
        }

        return self::$instance;
    }

    protected function __construct(){
        $extension = common_ext_ExtensionsManager::singleton()->getExtensionById('qtiItemPic');
        $this->baseDevDir = $extension->getConstant('DIR_VIEWS').'js/picCreator/dev/';
        $this->baseDevUrl = $extension->getConstant('BASE_WWW').'js/picCreator/dev/';
    }
    
    protected function getEntryPointFile($baseUrl){
        return $baseUrl.'/picCreator';
    }
    
    /**
     * Get PIC Creator hook directly located in views/js/picCreator/myCustomInteraction:
     * 
     * @return arrayallow
     */
    public function getDevInfoControls(){

        $returnValue = array();

        foreach(glob($this->baseDevDir.'*/picCreator.js') as $file){

            $dir = str_replace('picCreator.js', '', $file);
            $manifestFile = $dir.'picCreator.json';
            
            if(file_exists($manifestFile)){
                
                $typeIdentifier = basename($dir);
                $baseUrl = $this->baseDevUrl.$typeIdentifier.'/';
                $manifest = json_decode(file_get_contents($manifestFile), true);

                $returnValue[] = array(
                    'typeIdentifier' => $typeIdentifier,
                    'label' => $manifest['label'],
                    'directory' => $dir,
                    'baseUrl' => $baseUrl,
                    'file' => $this->getEntryPointFile($typeIdentifier),
                    'manifest' => $manifest,
                    'dev' => true
                );
                
            }else{
                \common_Logger::d('missing manifest file picCreator.json');
            }
        }

        return $returnValue;
    }
    
    public function getDevInfoControl($typeIdentifier){
        
        $devInfoControls = $this->getDevInfoControls();
        foreach($devInfoControls as $infoControl){
            if($infoControl['typeIdentifier'] == $typeIdentifier){
                return $infoControl;
            }
        }
        return null;
    }
}