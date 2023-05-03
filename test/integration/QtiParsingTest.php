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
 * Copyright (c) 2020  (original work) Open Assessment Technologies SA;
 */

declare(strict_types=1);

namespace oat\qtiItemPic\test\integration;

use common_Exception;
use common_exception_Error;
use common_ext_ExtensionsManager;
use oat\tao\test\TaoPhpUnitTestRunner;
use oat\taoQtiItem\model\qti\Item;
use oat\taoQtiItem\model\qti\Parser;

class QtiParsingTest extends TaoPhpUnitTestRunner
{
    protected function setUp(): void
    {
        parent::setUp();
        TaoPhpUnitTestRunner::initTest();
        common_ext_ExtensionsManager::singleton()->getExtensionById('taoQtiItem');
    }

    /**
     * @throws common_Exception
     * @throws common_exception_Error
     */
    public function testFileParsingQtiPic(): void
    {
        $extensionManager = common_ext_ExtensionsManager::singleton();

        if (!$extensionManager->isInstalled('qtiItemPic') || !$extensionManager->isEnabled('qtiItemPic')) {
            self::markTestSkipped('The extension qtiItemPic should be installed to run this test.');
        }

        $files = glob(__DIR__ . '/samples/xml/qtiv2p1/pic/*.xml');

        //check if samples are loaded
        foreach ($files as $file) {
            $qtiParser = new Parser($file);

            $qtiParser->validate();

            if (!$qtiParser->isValid()) {
                echo $qtiParser->displayErrors();
            }

            $item = $qtiParser->load();
            self::assertInstanceOf(Item::class, $item);
        }
    }
}
