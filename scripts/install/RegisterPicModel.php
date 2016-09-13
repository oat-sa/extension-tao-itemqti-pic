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

use oat\qtiItemPic\model\PicModel;
use oat\taoQtiItem\model\portableElement\model\PortableElementFactory;

class RegisterPicModel extends \common_ext_action_InstallAction
{
    public function __invoke($params)
    {
        $modelToRegister = array(PicModel::PIC_IDENTIFIER => new PicModel());

        if (! $this->getServiceLocator()->has(PortableElementFactory::SERVICE_ID)) {
            $data = $modelToRegister;
        } else {
            $data = array_merge(
                $this->getServiceLocator()->get(PortableElementFactory::SERVICE_ID)->getOptions(),
                $modelToRegister
            );
        }

        $this->getServiceManager()->register(PortableElementFactory::SERVICE_ID, new PortableElementFactory($data));
        return new \common_report_Report(\common_report_Report::TYPE_SUCCESS, 'Pic Model successfully registered.');
    }
}