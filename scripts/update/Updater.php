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

use oat\generis\model\OntologyAwareTrait;
use oat\qtiItemPic\scripts\install\RegisterPicModel;
use oat\qtiItemPic\scripts\install\RegisterClientProvider;
use oat\qtiItemPic\scripts\install\RegisterPicStudentToolbar;
use oat\qtiItemPic\scripts\install\RegisterPicStudentToolSample;
use oat\qtiItemPic\scripts\install\SetQtiCreatorConfig;
use oat\tao\model\accessControl\func\AccessRule;
use oat\tao\model\accessControl\func\AclProxy;
use oat\taoQtiItem\model\HookRegistry;
use oat\taoQtiItem\scripts\SetupPortableElementFileStorage;

class Updater extends \common_ext_ExtensionUpdater 
{
	use OntologyAwareTrait;

	/**
     * Updater
	 *
	 * @param string $initialVersion
     * @return string $versionUpdatedTo
     */
    public function update($initialVersion) {
        
		$this->skip('0.1','0.2.4');

		if ($this->isVersion('0.2.4')) {
			$setupPortableElementFileStorage = new SetupPortableElementFileStorage();
			$setupPortableElementFileStorage->setServiceLocator($this->getServiceManager());
			$setupPortableElementFileStorage([]);

			$registerPicModel = new RegisterPicModel();
			$registerPicModel->setServiceLocator($this->getServiceManager());
			$registerPicModel([]);

			$setQtiCreatorConfig = new SetQtiCreatorConfig();
			$setQtiCreatorConfig([]);

			$registerClientProvider = new RegisterClientProvider();
			$registerClientProvider([]);

            // Grants access on PciLoader for TestManager role.
            AclProxy::applyRule(new AccessRule(
                AccessRule::GRANT,
                'http://www.tao.lu/Ontologies/TAOItem.rdf#ItemsManagerRole',
                ['ext' => 'qtiItemPic' , 'mod' => 'PciLoader']
            ));

            // Grants access on PciLoader for QTIManager role.
            AclProxy::applyRule(new AccessRule(
                AccessRule::GRANT,
                'http://www.tao.lu/Ontologies/TAOItem.rdf#QTIManagerRole',
                ['ext' => 'qtiItemPic' , 'mod' => 'PciLoader']
            ));

            // Grants access on PciLoader for TestTaker role.
            AclProxy::applyRule(new AccessRule(
                AccessRule::GRANT,
                INSTANCE_ROLE_DELIVERY,
                ['ext' => 'qtiItemPic' , 'mod' => 'PciLoader']
            ));

			HookRegistry::getRegistry()->remove('picCreator');

			$this->setVersion('1.0.0');
		}

		$this->skip('1.0.0', '1.1.0');

		if ($this->isVersion('1.1.0')) {
			call_user_func(new RegisterPicStudentToolbar(), ['0.2.0']);
			call_user_func(new RegisterPicStudentToolSample(), ['0.2.0']);
			$this->setVersion('1.2.0');
		}

        $this->skip('1.2.0', '2.0.1');
    }
}