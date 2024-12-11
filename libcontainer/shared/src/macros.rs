#[macro_export]
macro_rules! join_img_abs {
    ($img_path: expr, $target: expr) => {{
        let target = if $target.has_root() {
            let mut iter = $target.components();
            iter.next();
            PathBuf::from_iter(iter)
        } else {
            $target
        };

        $img_path.join(target)
    }};
}

#[test]
fn test_join_img_abs() {
    use std::path::PathBuf;

    let virt_path = PathBuf::from("/var/fncs/some_file.json");
    let real_img_path = PathBuf::from("/tmp/some_image");

    assert_eq!(
        join_img_abs!(real_img_path, virt_path),
        PathBuf::from("/tmp/some_image/var/fncs/some_file.json")
    )
}
