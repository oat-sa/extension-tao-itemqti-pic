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
 * */

namespace oat\qtiItemPic\scripts\install;

use common_ext_ExtensionsManager;
use oat\taoQtiItem\model\portableElement\action\RegisterPortableElement;

class RegisterPicStudentToolbar extends RegisterPortableElement
{
    protected function getSourceDirectory()
    {
        $viewDir = common_ext_ExtensionsManager::singleton()->getExtensionById('qtiItemPic')->getConstant('DIR_VIEWS');

        return $viewDir . implode(DIRECTORY_SEPARATOR, ['js', 'picCreator', 'dev', 'studentToolbar']);
    }
}
