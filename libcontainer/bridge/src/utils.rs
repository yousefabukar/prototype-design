use std::path::Path;
use tokio::{fs, io};

pub async fn copy_dir<T>(src: T, dest: T) -> Result<(), io::Error>
where
    T: AsRef<Path>,
{
    fs::create_dir_all(&dest).await?;

    while let Some(entry) = fs::read_dir(&src).await?.next_entry().await? {
        if entry.file_type().await?.is_dir() {
            copy_dir(entry.path(), dest.as_ref().join(entry.file_name())).await?;
        } else {
            fs::copy(entry.path(), dest.as_ref().join(entry.file_name())).await?;
        }
    }

    todo!()
}
