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
use oat\qtiItemPic\model\PicModel;
use oat\qtiItemPic\model\portableElement\storage\PicRegistry;
use oat\qtiItemPic\scripts\install\RegisterPicFilesystem;
use oat\qtiItemPic\scripts\install\RegisterPicModel;
use oat\qtiItemPic\scripts\install\RegisterClientProvider;
use oat\qtiItemPic\scripts\install\RegisterPicStudentToolbar;
use oat\qtiItemPic\scripts\install\RegisterPicStudentToolSample;
use oat\qtiItemPic\scripts\install\SetQtiCreatorConfig;
use oat\tao\model\accessControl\func\AccessRule;
use oat\tao\model\accessControl\func\AclProxy;
use oat\tao\model\TaoOntology;
use oat\taoQtiItem\model\HookRegistry;
use oat\taoQtiItem\model\portableElement\model\PortableModelRegistry;
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
    public function update($initialVersion)
    {

        $this->runExtensionScript(RegisterPicFilesystem::class);

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
				TaoOntology::PROPERTY_INSTANCE_ROLE_DELIVERY,
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


        if($this->isVersion('2.0.1')){
            $this->runExtensionScript(RegisterPicFilesystem::class);

            $model = new PicModel();
            $registry = PicRegistry::getRegistry();
            $registry->setServiceLocator($this->getServiceManager());
            $registry->setModel($model);

            /** @var \common_ext_ExtensionsManager $extensionManager */
            $extensionManager = $this->getServiceManager()->get(\common_ext_ExtensionsManager::SERVICE_ID);
            $map = $extensionManager->getExtensionById(PicRegistry::REGISTRY_EXTENSION)->getConfig(PicRegistry::REGISTRY_ID);

            foreach ($map as $key => $value){
                uksort($value, function($a, $b) {
                    return version_compare($a, $b, '<');
                });
                $portableElementObject = $model->createDataObject(reset($value));
                //set it the new way
                $registry->update($portableElementObject);
            }

            $extensionManager->getExtensionById(PicRegistry::REGISTRY_EXTENSION)->unsetConfig(PicRegistry::REGISTRY_ID);
            $this->setVersion('3.0.0');
        }

        $this->skip('3.0.0', '3.0.1');

        if($this->isVersion('3.0.1')) {
            //automatically enable all current installed portable elements
            $model = PortableModelRegistry::getRegistry()->getModel(PicModel::PIC_IDENTIFIER);
            $portableElementRegistry = $model->getRegistry();
            $registeredPortableElements = array_keys($portableElementRegistry->getLatestRuntimes());
            foreach($registeredPortableElements as $typeIdentifier){
                $portableElement = $portableElementRegistry->fetch($typeIdentifier);
                if (! $portableElement->hasEnabled()) {
                    $portableElement->enable();
                    $portableElementRegistry->update($portableElement);
                }
            }
            $this->setVersion('3.0.2');
        }

        $this->skip('3.0.2', '4.0.0');

        if($this->isVersion('4.0.0')) {
            call_user_func(new RegisterPicStudentToolbar(), ['0.4.0']);
            call_user_func(new RegisterPicStudentToolSample(), ['0.4.0']);
            $this->setVersion('4.1.0');
        }

        $this->skip('4.1.0', '5.0.0');

          if($this->isVersion('5.0.0')) {
            call_user_func(new RegisterPicStudentToolSample(), ['0.4.1']);
            $this->setVersion('5.0.1');
        }

        $this->skip('5.0.1', '5.3.1');
    }
}
