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
 * Copyright (c) 2016-2022 (original work) Open Assessment Technologies;
 */

use oat\qtiItemPic\scripts\install\RegisterClientProvider;
use oat\qtiItemPic\scripts\install\RegisterPicFilesystem;
use oat\qtiItemPic\scripts\install\RegisterPicModel;
use oat\qtiItemPic\scripts\install\RegisterPicStudentToolbar;
use oat\qtiItemPic\scripts\install\RegisterPicStudentToolSample;
use oat\qtiItemPic\scripts\install\SetQtiCreatorConfig;
use oat\qtiItemPic\scripts\uninstall\UninstallPIC;
use oat\taoQtiItem\scripts\SetupPortableElementFileStorage;

return [
    'name' => 'qtiItemPic',
    'label' => 'QTI Portable Info Control',
    'description' => '',
    'license' => 'GPL-2.0',
    'author' => 'Open Assessment Technologies',
    'acl' => [
        ['grant', 'http://www.tao.lu/Ontologies/generis.rdf#qtiItemPicManager', ['ext' => 'qtiItemPic']],
        [
            'grant',
            'http://www.tao.lu/Ontologies/TAOItem.rdf#QTIManagerRole',
            ['ext' => 'qtiItemPic', 'mod' => 'PicLoader'],
        ],
        [
            'grant',
            'http://www.tao.lu/Ontologies/TAOItem.rdf#ItemsManagerRole',
            ['ext' => 'qtiItemPic', 'mod' => 'PicLoader'],
        ],
        [
            'grant',
            'http://www.tao.lu/Ontologies/TAO.rdf#DeliveryRole',
            ['ext' => 'qtiItemPic', 'mod' => 'PicLoader'],
        ],
    ],
    'install' => [
        'rdf' => [
            dirname(__FILE__) . '/install/ontology/role.rdf',
        ],
        'php' => [
            RegisterPicFilesystem::class,
            SetupPortableElementFileStorage::class,
            RegisterPicModel::class,
            SetQtiCreatorConfig::class,
            RegisterClientProvider::class,
            RegisterPicStudentToolbar::class,
            RegisterPicStudentToolSample::class,
        ],
    ],
    'uninstall' => [
        'php' => [
            UninstallPIC::class,
        ],
    ],
    'update' => 'oat\\qtiItemPic\\scripts\\update\\Updater',
    'routes' => [
        '/qtiItemPic' => 'oat\\qtiItemPic\\controller',
    ],
    'constants' => [
        # views directory
        'DIR_VIEWS' => dirname(__FILE__) . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR,

        #BASE URL (usually the domain root)
        'BASE_URL' => ROOT_URL . 'qtiItemPic/',
    ],
    'extra' => [
        'structures' => dirname(__FILE__) . DIRECTORY_SEPARATOR . 'controller' . DIRECTORY_SEPARATOR . 'structures.xml',
    ],
];
