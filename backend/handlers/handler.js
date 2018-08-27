function handleDocument(req, res) {
    try {
        var id = generateUUID();
        var part = req.parts[0];
        var filename = ''+ id + '_' + part.fileName;
        var file = new File(ds.getModelFolder().path + '../../documents/' + filename);
        part.asBlob.copyTo(file, true);
        return filename;
    } catch (err) {
        return err.message;
    }
}