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
