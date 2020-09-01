<?php

declare(strict_types=1);

namespace oat\qtiItemPic\migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\Exception\IrreversibleMigration;
use oat\tao\scripts\tools\migrations\AbstractMigration;
use oat\qtiItemPic\scripts\install\RegisterPicStudentToolSample;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version202009011223111298_qtiItemPic extends AbstractMigration
{

    public function getDescription(): string
    {
        return 'Upgrade studentToolSample 0.4.2 -> 0.4.3';
    }

    public function up(Schema $schema): void
    {
        call_user_func(new RegisterPicStudentToolSample(), ['0.4.3']);
    }

    public function down(Schema $schema): void
    {
        throw new IrreversibleMigration(
            'In order to undo this migration, please revert the client-side changes and run ' . RegisterPicStudentToolSample::class
        );
    }
}
