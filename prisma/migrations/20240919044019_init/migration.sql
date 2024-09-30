-- CreateTable
CREATE TABLE `Pelanggan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `nomor_telp` VARCHAR(191) NOT NULL DEFAULT '',
    `jenis_kelamin` ENUM('Laki_laki', 'Perempuan') NOT NULL DEFAULT 'Laki_laki',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pelanggan_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Game` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `gambar` VARCHAR(191) NOT NULL DEFAULT '',
    `video` VARCHAR(191) NOT NULL DEFAULT '',
    `developer` VARCHAR(191) NOT NULL DEFAULT '',
    `harga` INTEGER NOT NULL DEFAULT 0,
    `deskripsi` TEXT NOT NULL DEFAULT '',
    `genre` VARCHAR(191) NOT NULL DEFAULT '',
    `tahun_rilis` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `download_link` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idPelanggan` INTEGER NULL,
    `idAdmin` INTEGER NULL,
    `status` ENUM('Belum_Lunas', 'Lunas') NOT NULL DEFAULT 'Belum_Lunas',
    `metode_pembayaran` ENUM('QRIS', 'Transfer_bank') NOT NULL DEFAULT 'QRIS',
    `total_bayar` INTEGER NOT NULL DEFAULT 0,
    `tanggal_transaksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Detail_Transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idTransaski` INTEGER NULL,
    `idGame` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_idPelanggan_fkey` FOREIGN KEY (`idPelanggan`) REFERENCES `Pelanggan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_Transaksi` ADD CONSTRAINT `Detail_Transaksi_idTransaski_fkey` FOREIGN KEY (`idTransaski`) REFERENCES `Transaksi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_Transaksi` ADD CONSTRAINT `Detail_Transaksi_idGame_fkey` FOREIGN KEY (`idGame`) REFERENCES `Game`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
