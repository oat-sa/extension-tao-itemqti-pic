<?php
/**
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

namespace oat\qtiItemPic\controller;

use \tao_actions_CommonModule;
use \core_kernel_classes_Resource;
use oat\qtiItemPic\model\CreatorRegistry;
use oat\taoQtiItem\helpers\Authoring;

class PicManager extends tao_actions_CommonModule
{
    
    public function __construct(){
        parent::__construct();
        $this->registry = CreatorRegistry::singleton();
    }
    
    public function getFile(){

        if($this->hasRequestParameter('file')){
            $file = urldecode($this->getRequestParameter('file'));
            $filePathTokens = explode('/', $file);
            $pciTypeIdentifier = array_shift($filePathTokens);
            $relPath = implode(DIRECTORY_SEPARATOR, $filePathTokens);
            $this->renderFile($pciTypeIdentifier, $relPath);
        }
    }

    private function renderFile($typeIdentifier, $relPath){

        $folder = $this->registry->getDevInfoControlDirectory($typeIdentifier);
        
        if(tao_helpers_File::securityCheck($relPath, true)){
            $filename = $folder.$relPath;
            //@todo : find better way to to this
            //load amd module
            if(!file_exists($filename) && file_exists($filename.'.js')){
                $filename = $filename.'.js';
            }
            tao_helpers_Http::returnFile($filename);
        }else{
            throw new common_exception_Error('invalid item preview file path');
        }
    }

    /**
     * Add required resources from a custom interaction (css, js) to the RDF Item
     * 
     * @throws common_exception_Error
     */
    public function addRequiredResources(){
        
        //get params
        $typeIdentifier = $this->getRequestParameter('typeIdentifier');
        $itemUri = urldecode($this->getRequestParameter('uri'));
        $item = new core_kernel_classes_Resource($itemUri);
        
        //find the interaction in the registry
        $infoControl = $this->registry->getDevInfoControl($typeIdentifier);
        if(is_null($infoControl)){
            throw new common_exception_Error('no PIC found with the type identifier '.$typeIdentifier);
        }
        
        //get the root directory of the interaction
        $directory = $infoControl['directory'];
        
        //get the lists of all required resources
        $manifest = $infoControl['manifest'];
        $required = array($manifest['entryPoint']);
        
        //include libraries remotely only, so this block is temporarily disabled
        if(isset($manifest['libraries']) && false){
            $required = array_merge($required, array_values($manifest['libraries']));
        }
        
        //include custom interaction specific css in the item
        if(isset($manifest['css'])){
            $required = array_merge($required, array_values($manifest['css']));
        }
        
        //include media in the item
        if(isset($manifest['media'])){
            $required = array_merge($required, array_values($manifest['media']));
        }
        
        //add them to the rdf item
        $resources = Authoring::addRequiredResources($directory, $required, $item, '');
        
        $this->returnJson(array(
            'success' => true,
            'resources' => $resources
        ));
    }

}