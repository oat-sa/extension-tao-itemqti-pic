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
 * Copyright (c) 2016 (original work) Open Assessment Technologies SA;
 *
 */

namespace oat\qtiItemPic\model;

use oat\oatbox\service\ServiceManager;

use oat\qtiItemPic\model\portableElement\dataObject\PicDataObject;
use oat\qtiItemPic\model\portableElement\parser\PicDirectoryParser;
use oat\qtiItemPic\model\portableElement\parser\PicItemParser;
use oat\qtiItemPic\model\portableElement\parser\PicPackagerParser;
use oat\qtiItemPic\model\portableElement\storage\PicRegistry;
use oat\qtiItemPic\model\portableElement\validator\PicValidator;
use oat\taoQtiItem\model\portableElement\common\storage\PortableElementRegistry;
use oat\taoQtiItem\model\portableElement\PortableElement;

class PicModel implements PortableElement
{
    const PIC_IDENTIFIER = 'PIC';

    const PIC_MANIFEST = 'picCreator.json';

    const PIC_ENGINE = 'picCreator.js';

    public function getId()
    {
        return self::PIC_IDENTIFIER;
    }

    public function getDefinitionFiles()
    {
        return [
            self::PIC_MANIFEST,
            self::PIC_ENGINE
        ];
    }

    public function getManifestName()
    {
        return self::PIC_MANIFEST;
    }

    public function createDataObject(array $data)
    {
        $object = (new PicDataObject())->exchangeArray($data);
        $object->setModel($this);
        return $object;
    }

    public function getRegistry()
    {
        /** @var PortableElementRegistry $registry */
        $registry = PicRegistry::getRegistry();
        $registry->setServiceLocator(ServiceManager::getServiceManager());
        $registry->setModel($this);
        return $registry;
    }

    public function getValidator()
    {
        return new PicValidator();
    }

    public function getDirectoryParser()
    {
        $directoryParser = new PicDirectoryParser();
        $directoryParser->setModel($this);
        return $directoryParser;
    }

    public function getPackageParser()
    {
        $packageParser = new PicPackagerParser();
        $packageParser->setModel($this);
        return $packageParser;
    }

    public function getItemParser()
    {
        $itemParser = new PicItemParser();
        $itemParser->setModel($this);
        return $itemParser;
    }

    public function __toPhpCode()
    {
        return "new " . __CLASS__."()";
    }
}