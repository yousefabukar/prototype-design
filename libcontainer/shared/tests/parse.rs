use shared::image::{ImageManifest, ImageOptions, TestOutput};

#[test]
fn test_opts() {
    let good_opts = serde_json::json!({
        "cpus": 8,
        "mem": 128_000_000,
    });

    let bad_opts = serde_json::json!({
        "cpus": "hello",
        "mem": -1,
        "other": 0,
    });

    assert!(serde_json::from_value::<ImageOptions>(good_opts).is_ok());
    assert!(serde_json::from_value::<ImageOptions>(bad_opts).is_err());
}

#[test]
fn test_manifest() {
    let good_manifest = serde_json::json!({
        "extraction_dir": "/var/fncs/submission",
        "test_script": "/var/fncs/run_test.sh",
        "test_manifest": "/var/fncs/test_output.json",
    });

    let bad_manifest = serde_json::json!({
        "test_script": "/not/a/path",
        "manifest": "/other"
    });

    assert!(serde_json::from_value::<ImageManifest>(good_manifest).is_ok());
    assert!(serde_json::from_value::<ImageManifest>(bad_manifest).is_err());
}

#[test]
fn test_output() {
    let output = TestOutput {
        passed: false,
        weight: 20,
    };

    assert_eq!(
        serde_json::to_value(&output).unwrap(),
        serde_json::json!({
            "passed": false,
            "weight": 20,
        })
    )
}
