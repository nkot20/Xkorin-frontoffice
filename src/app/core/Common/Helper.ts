export class Helper {
    static uploadImage(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                // Obtention de l'image en base64
                const base64String = reader.result as string;

                // Vérification si l'image est au format base64
                if (!base64String.startsWith('data:image')) {
                    reject(new Error('Le fichier uploadé n\'est pas une image valide.'));
                    return;
                }

                // Renvoie de l'image en base64
                resolve(base64String);
            };

            // Lecture du fichier en tant que URL de données (base64)
            reader.readAsDataURL(file);
        });
    }

}
