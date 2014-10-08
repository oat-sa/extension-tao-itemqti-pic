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

namespace oat\qtiItemPci\controller;

use \core_kernel_classes_Resource;
use oat\qtiItemPci\helpers\Creator as CreatorHelper;

class PicManager extends tao_actions_CommonModule
{

    public function getFile(){

        if($this->hasRequestParameter('file')){
            $file = urldecode($this->getRequestParameter('file'));
            $filePathTokens = explode('/', $file);
            $pciTypeIdentifier = array_shift($filePathTokens);
            $relPath = implode(DIRECTORY_SEPARATOR, $filePathTokens);
            $this->renderFile($pciTypeIdentifier, $relPath);
        }
    }

    private function renderFile($pciTypeIdentifier, $relPath){

        $base = common_ext_ExtensionsManager::singleton()->getExtensionById('qtiItemPic')->getConstant('DIR_VIEWS');
        $folder = $base.'js'.DIRECTORY_SEPARATOR.'picCreator'.DIRECTORY_SEPARATOR.'dev'.DIRECTORY_SEPARATOR.$pciTypeIdentifier.DIRECTORY_SEPARATOR;

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

    public function addRequiredResources(){

        $typeIdentifier = $this->getRequestParameter('typeIdentifier');
        $itemUri = urldecode($this->getRequestParameter('uri'));
        $item = new core_kernel_classes_Resource($itemUri);

        $resources = CreatorHelper::addRequiredResources($typeIdentifier, $item, '');
        $this->returnJson(array(
            'success' => true,
            'resources' => $resources
        ));
    }

}