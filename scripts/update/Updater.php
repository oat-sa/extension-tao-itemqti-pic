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
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA;
 *
 *
 */

namespace oat\qtiItemPic\scripts\update;

use oat\qtiItemPic\scripts\install\SetupPicRegistry;
use oat\qtiItemPic\scripts\install\RegisterClientProvider;
use oat\qtiItemPic\scripts\install\RegisterPic;
use oat\qtiItemPic\scripts\install\SetQtiCreatorConfig;
use oat\taoQtiItem\model\HookRegistry;

class Updater extends \common_ext_ExtensionUpdater 
{

	/**
     * Updater
	 *
	 * @param string $initialVersion
     * @return string $versionUpdatedTo
     */
    public function update($initialVersion) {
        
		if (
			$this->isVersion('0.1')   || 
			$this->isVersion('0.1.1') || 
			$this->isVersion('0.2')	  || 
			$this->isVersion('0.2.1') || 
			$this->isVersion('0.2.2') 
			)
		{
			$this->setVersion('0.2.3');
		}

		if ($this->isVersion('0.2.3')) {
			$setupPicRegistry = new SetupPicRegistry();
			$setupPicRegistry->setServiceLocator($this->getServiceManager());
			$setupPicRegistry->updateTo1_0_0();

			$setQtiCreatorConfig = new SetQtiCreatorConfig();
			$setQtiCreatorConfig([]);

			$registerClientProvider = new RegisterClientProvider();
			$registerClientProvider([]);

			$registerPic = new RegisterPic();
			$registerPic([]);

			HookRegistry::getRegistry()->remove('picCreator');

			$this->setVersion('1.0.0');
		}
	}
}