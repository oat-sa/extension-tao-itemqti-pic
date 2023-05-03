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
 * Copyright (c) 2022 (original work) Open Assessment Technologies SA;
 */

namespace oat\qtiItemPic\scripts\uninstall;

use Exception;
use oat\oatbox\extension\InstallAction;
use oat\oatbox\filesystem\FileSystemService;
use oat\oatbox\reporting\Report;
use oat\taoQtiItem\model\portableElement\clientConfigRegistry\InfoControlRegistry;
use oat\taoQtiItem\model\portableElement\model\PortableModelRegistry;
use oat\taoQtiItem\model\QtiCreatorClientConfigRegistry;

class UninstallPIC extends InstallAction
{
    public function __invoke($params): Report
    {
        $report = Report::createInfo('Uninstalling PIC components');

        $report->add(Report::createInfo('Removing client plugins'));
        QtiCreatorClientConfigRegistry::getRegistry()
            ->removePlugin('picManager', 'qtiItemPic/qtiCreator/plugins/panel/picManager', 'panel');

        InfoControlRegistry::getRegistry()
            ->removeProvider('picRegistry', 'qtiItemPic/picProvider');

        $report->add(Report::createInfo('Removing registry'));
        PortableModelRegistry::getRegistry()->remove('PIC');

        try {
            /** @var FileSystemService $fileSystemService */
            $fileSystemService = $this->getServiceLocator()->get(FileSystemService::SERVICE_ID);

            if ($fileSystemService->hasDirectory('qtiItemPic')) {
                $fileSystemService->unregisterFileSystem('qtiItemPic');
                $this->registerService(FileSystemService::SERVICE_ID, $fileSystemService);
            }
        } catch (Exception $e) {
            $report->add(Report::createError('Fail to remove qtiItemPic directory.'));
        }

        return $report;
    }
}
